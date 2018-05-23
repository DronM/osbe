/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc Model based on JSON data
 
 * @requires core/extend.js
 * @requires core/Model.js 
 * @requires core/CommonHelper.js
 
 * @param {string} id - Model identifier
 * @param {object} options
 * @param {object} options.fields
 * @param {string|object} options.data - Can either be a string or a JSON node
 * @param {string} [options.tagModel=this.DEF_TAG_MODEL]
 * @param {string} [options.tagRow=this.DEF_TAG_ROW]
 * @param {string} [options.tagRows=this.DEF_TAG_ROWS]   
 */
function ModelJSON(id,options){	
	
	//this.setTagModel(options.tagModel || this.DEF_TAG_MODEL);
	this.setTagRow(options.tagRow || this.DEF_TAG_ROW);
	this.setTagRows(options.tagRows || this.DEF_TAG_ROWS);
	
	options.markOnDelete = (options.markOnDelete!=undefined)? options.markOnDelete:false;
	options.primaryKeyIndex = (options.primaryKeyIndex!=undefined)? options.primaryKeyIndex:true;
	
	ModelJSON.superclass.constructor.call(this,id,options);
}
extend(ModelJSON,Model);

/* CONSTANTS */
ModelJSON.prototype.ATTR_TOT_COUNT = "totalCount";
ModelJSON.prototype.ATTR_PG_COUNT = "rowsPerPage";
ModelJSON.prototype.ATTR_PG_FROM = "listFrom";
ModelJSON.prototype.ATTR_DELETED = "deleted";
ModelJSON.prototype.ATTR_INSERTED = "inserted";
ModelJSON.prototype.ATTR_UPDATED = "updated";

//ModelJSON.prototype.DEF_TAG_MODEL = "model";
ModelJSON.prototype.DEF_TAG_ROW = "row";
ModelJSON.prototype.DEF_TAG_ROWS = "rows";
ModelJSON.prototype.TAG_AT_ID = "id";

/* private members */
ModelJSON.prototype.m_model;

ModelJSON.prototype.m_tagModel;
ModelJSON.prototype.m_tagRow;
ModelJSON.prototype.m_tagRows;

/**
 * Retrieves specific row
 */
ModelJSON.prototype.fetchRow = function(row){
	this.resetFields();
	
	for (fid in row.fields){
		if (this.m_fields[fid]){
			//field exists in MD
			var t_val = null;
			if (row.fields[fid]!=undefined){
				t_val = row.fields[fid];
			}
			if (t_val=="" && this.m_fields[fid].getValidator() && this.m_fields[fid].getValidator().getRequired()){
				/**
				 * to prevent throwing error in case field is required but there is no
				 * value in database
				 */
			}
			else if (t_val!==null){
			//console.log("ModelJSON.prototype.fetchRow Setting id="+fid+" t_val=")
			//console.dir(t_val)
				this.m_fields[fid].setValue(t_val);
			}							
		}	
	}
	
	return true;
}

ModelJSON.prototype.getRows = function(includeDeleted){
	return this.m_model[this.getTagRows()];
}

ModelJSON.prototype.copyRow = function(row){
	this.m_model[this.getTagRows()].push(JSON.parse(JSON.stringify(row)));
}

ModelJSON.prototype.deleteRow = function(row,mark){
	ModelJSON.superclass.deleteRow.call(this,row,mark);
	if (mark){
		row[this.ATTR_DELETED] = "1";
	}
	else{
		var ind = CommonHelper.inArray(row,this.m_model[this.getTagRows()]);
		if (ind>=0){			
			this.m_model[this.getTagRows()].splice(ind, 1);
		}
	}
}

ModelJSON.prototype.undeleteRow = function(row){
	row[this.ATTR_DELETED] = "0";
}

/*
 * @private
 */
ModelJSON.prototype.addRow = function(row){	
	//row[this.ATTR_INSERTED] = "1";
	this.m_model[this.getTagRows()].push(row);
}
ModelJSON.prototype.updateRow = function(row){	
	ModelJSON.superclass.updateRow.call(this,row);
	
	//row[this.ATTR_UPDATED] = "1";
}

ModelJSON.prototype.makeRow = function(){
	var row = {"fields":{}};	
	for (var fid in this.m_fields){
		row.fields[fid] = this.m_fields[fid].getValue();
	}
	return row;
}

ModelJSON.prototype.setRowValues = function(row){
	for (var id in this.m_fields){
	//console.log("ModelJSON.prototype.setRowValues id="+id)
		if (this.m_fields[id].isSet()){
			//console.log("   setting val=")
			//console.dir(this.m_fields[id].getValue());
			row.fields[id] = this.m_fields[id].getValue();
		}
	}	
}

ModelJSON.prototype.initSequences = function(){
	for (sid in this.m_sequences){
		this.m_sequences[sid] = (this.m_sequences[sid]==undefined)? 0:this.m_sequences[sid];
		if (!this.m_model[this.getTagRows()]){
			return;
		}
		for (var r=0;r<this.m_model[this.getTagRows()].length;r++){
			var row = this.m_model[this.getTagRows()][r];
			for (var c in row.fields){
				if (c==sid){
					var dv = parseInt(row.fields[c],10);
					if (this.m_sequences[sid]<dv){
						this.m_sequences[sid] = dv;
					}
					break;
				}
			}
		}
		//console.log("Sequence "+sid+"=")
		//console.dir(this.m_sequences[sid])
							
	}		
}

/**
 * @public
 * @param {JSON|string} data
 * rows:[{"fields":{"f1":"v1","f2":"v2"}}]
 */
ModelJSON.prototype.setData = function(data){
/*
	if (this.getLocked()){
		throw Error(this.ER_LOCKED);
	}
*/	
	var no_data = false;
	
	if (!data){
		data = {"id":this.getId()};
		data[this.getTagRows()] = [];
		no_data = true;
	}
	
	if (typeof(data) == "string"){
		this.m_model = CommonHelper.unserialize(data);
	}
	else{
		this.m_model = data;
	}
	if (!this.m_model.id){
		this.m_model.id = this.getId();
	}
	
	//lazy fields definition based on data
	if (!this.m_fields && this.m_model.rows && this.m_model.rows.length){
		if (this.m_model.rows[0].fields){
			this.m_fields = {};
			for (fid in this.m_model.rows[0].fields){
				this.m_fields[fid] = new FieldString(fid,{"value":this.m_model.rows[0].fields[fid]});
			}
		}
	}
	/*
	if (!this.m_model || this.m_model.id!=this.getId()){
		throw new Error(CommonHelper.format(this.ER_NO_MODEL,Array(this.getId())));
	}
	*/
	if (this.m_model["toString"]){
		var self = this;
		this.m_model["toString"] = function(){
			return CommonHelper.serialize(self.m_model);
		}
	}
	
	if (!no_data){
		this.initSequences();
		this.reindex();
	}
			
	ModelJSON.superclass.setData.call(this,data);
}

/**
 * @public
 * @returns {Object}
 */
ModelJSON.prototype.getData = function(){
	return this.m_model;
}

ModelJSON.prototype.getRowCount = function(includeDeleted){
	var rows = this.getRows(includeDeleted);
	return rows? rows.length : 0;
}

ModelJSON.prototype.getTotCount = function(){	
	return this.getAttr(this.ATTR_TOT_COUNT);
}

ModelJSON.prototype.getPageCount = function(){	
	return this.getAttr(this.ATTR_PG_COUNT);
}

ModelJSON.prototype.getPageFrom = function(){	
	return this.getAttr(this.ATTR_PG_FROM);
}
ModelJSON.prototype.getAttr = function(attr){
	if (this.m_model){
		return this.m_model[attr];
	}

}

ModelJSON.prototype.clear = function(){
	this.m_model[this.getTagRows()] = [];
}

/*
ModelJSON.prototype.getTagModel = function(){
	return this.m_tagModel;
}
ModelJSON.prototype.setTagModel = function(v){
	this.m_tagModel = v;
}
*/
ModelJSON.prototype.getTagRow = function(){
	return this.m_tagRow;
}
ModelJSON.prototype.setTagRow = function(v){
	this.m_tagRow = v;
}
ModelJSON.prototype.getTagRows = function(){
	return this.m_tagRows;
}
ModelJSON.prototype.setTagRows = function(v){
	this.m_tagRows = v;
}

/**
 * @public
 * @param {int} ind row index to move 
 * @param {int} cnt count, can be negative 
 */
ModelJSON.prototype.recMove = function(ind,cnt){
	var mv_ind = this.getRowIndex() + cnt;
	if (mv_ind>=0 && mv_ind<this.getRowCount()){
		var tag = this.getTagRows();
		var elem = JSON.parse(JSON.stringify(this.m_model[tag][ind]));
		this.m_model[tag].splice(ind, 1);
		this.m_model[tag].splice(mv_ind, 0, elem);
	}
}

