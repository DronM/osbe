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

	options.cellElements = options.cellElements || 	
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
	];

	GridColumnRef.superclass.constructor.call(this,options);
}
extend(GridColumnRef,GridColumn);

/* Constants */


/* private members */
GridColumn.prototype.m_keys;
GridColumn.prototype.m_form;

GridColumnRef.prototype.setCellValue = function(fields){
	var f = this.getField();
	if (!f.isNull()){
		var v = f.getValue();
		if (typeof(v)=="string"){
			//field of type string linked to Ref column
			v = CommonHelper.unserialize(v);
		}	
		this.m_keys = (v.getKeys)? v.getKeys():null;	
		return v.getDescr? v.getDescr():"";
	}
}

/* protected*/


/* public methods */
GridColumn.prototype.getForm = function(){
	return this.m_form;
}
GridColumn.prototype.setForm = function(v){
	this.m_form = v;
}
