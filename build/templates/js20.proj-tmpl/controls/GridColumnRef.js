/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends GridColumn
 * @requires core/extend.js
 * @requires controls/GridColumn.js     

 * @class
 * @classdesc
 
 * @param {object} options
 * @param {object} options.cellElements
 * @param {WindowObjectForm} options.form
 */
function GridColumnRef(options){
	options = options || {};	
	
	var self = this;
	options.formatFunction = function(fields){
		return self.setCellValue();		
	}

	this.setForm(options.form);

	options.cellElements = options.cellElements || 	(
	options.form?
	[
		{"elementClass":Control,
		"elementOptions":{
			"tagName":"A",
			"href":"#",
			"events":{
				"click":function(){
					if (self.m_keys && self.m_form){
						var f = new self.m_form({"keys":self.m_keys});
						f.open();
					}
				}
			}
			}
		}
	]
	: null
	);

	GridColumnRef.superclass.constructor.call(this,options);
}
extend(GridColumnRef,GridColumn);

/* Constants */


/* private members */
GridColumn.prototype.m_keys;
GridColumn.prototype.m_form;

GridColumnRef.prototype.getObjectDescr = function(v){
	this.m_keys = (v.getKeys)? v.getKeys() : (v.keys? v.keys:null);	
	var no_keys = false;
	for (key in this.m_keys){
		if (this.m_keys[key]==null){
			no_keys = true;
			break;
		}
	}
	return !no_keys? (v.getDescr? v.getDescr(): (v.descr? v.descr : (v.m_descr? v.m_descr:this.m_keys) ) ) : "";
}

GridColumnRef.prototype.setCellValue = function(fields){
	var f = this.getField();
	var res = "";
	//console.log("GridColumnRef.prototype.setCellValue v=")
	
	if (!f.isNull()){
		var v = f.getValue();
		
		if (typeof v =="string"){
			//field of type string linked to Ref column
			v = CommonHelper.unserialize(v);
		}	
		if(CommonHelper.isArray(v)){
			//array of objects
			for(var i=0;i<v.length;i++){
				res+= (res=="")? "":", ";
				res+= this.getObjectDescr(v[i]);
			}
		}
		else{
			res = this.getObjectDescr(v);
			/*
			this.m_keys = (v.getKeys)? v.getKeys() : (v.keys? v.keys:null);	
			var no_keys = false;
			for (key in this.m_keys){
				if (this.m_keys[key]==null){
					no_keys = true;
					break;
				}
			}
			res = !no_keys? (v.getDescr? v.getDescr(): (v.descr? v.descr : (v.m_descr? v.m_descr:this.m_keys) ) ) : "";
			*/
		}
	}
	return res;
}

/* protected*/


/* public methods */
GridColumn.prototype.getForm = function(){
	return this.m_form;
}
GridColumn.prototype.setForm = function(v){
	this.m_form = v;
}
