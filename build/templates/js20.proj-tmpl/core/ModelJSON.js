/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc Model based on JSON data
 
 * @requires core/extend.js
 * @requires core/Model.js 
 * @requires core/CommonHelper.js
 
 * @param {string} id - Model identifier
 * @param {Object} options
 * @param {namespace} options.fields
 * @param {string|Object} options.data - Can either be a string or a JSON node
 * @param {string} [options.tagModel=this.DEF_TAG_MODEL]
 * @param {string} [options.tagRow=this.DEF_TAG_ROW] 
 */
function ModelJSON(id,options){	
	
	this.setTagModel(options.tagModel || this.DEF_TAG_MODEL);
	this.setTagRow(options.tagRow || this.DEF_TAG_ROW);
	
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

ModelJSON.prototype.DEF_TAG_MODEL = "model";
ModelJSON.prototype.DEF_TAG_ROW = "row";
ModelJSON.prototype.TAG_AT_ID = "id";

/* private members */
ModelJSON.prototype.m_model;

ModelJSON.prototype.m_tagModel;
ModelJSON.prototype.m_tagRow;

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
				this.m_fields[fid].setValue(t_val);
			}							
		}	
	}
	
	return true;
}

ModelJSON.prototype.getRows = function(includeDeleted){
	return this.m_model.rows;
}

ModelJSON.prototype.copyRow = function(row){
	this.m_model.rows.push(CommonHelper.clone(row));
}

ModelJSON.prototype.deleteRow = function(row,mark){
	ModelJSON.superclass.deleteRow.call(this,row,mark);
	if (mark){
		row[this.ATTR_DELETED] = "1";
	}
	else{
		var ind = CommonHelper.inArray(row,this.m_model.rows);
		if (ind>=0){			
			this.m_model.rows.splice(ind, 1);
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
	row[this.ATTR_INSERTED] = "1";
	this.m_model.rows.push(row);
}
ModelJSON.prototype.updateRow = function(row){	
	ModelJSON.superclass.updateRow.call(this,row);
	
	row[this.ATTR_UPDATED] = "1";
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
		if (this.m_fields[id].isSet()){
			row.fields[id] = this.m_fields[id].getValue();
		}
	}	
}

ModelJSON.prototype.initSequences = function(){
	for (sid in this.m_sequences){
		this.m_sequences[sid] = (this.m_sequences[sid]==undefined)? 0:this.m_sequences[sid];
		for (var r=0;r<this.m_model.rows.length;r++){
			var row = this.m_model.rows[r];
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
	}		
}

/**
 * @public
 * @param {JSON|string} data
 */
ModelJSON.prototype.setData = function(data){
/*
	if (this.getLocked()){
		throw Error(this.ER_LOCKED);
	}
*/	
	var no_data = false;
	
	if (!data){
		data = {"id":this.getId(),"rows":[]};
		no_data = true;
	}
	
	if (typeof(data) == "string"){
		this.m_model = CommonHelper.unserialize(data);
	}
	else{
		this.m_model = data;
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
	if (rows) {
		return rows.length;
	}
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
	this.m_model.rows = [];
}

ModelJSON.prototype.getTagModel = function(){
	return this.m_tagModel;
}
ModelJSON.prototype.setTagModel = function(v){
	this.m_tagModel = v;
}
ModelJSON.prototype.getTagRow = function(){
	return this.m_tagRow;
}
ModelJSON.prototype.setTagRow = function(v){
	this.m_tagRow = v;
}

