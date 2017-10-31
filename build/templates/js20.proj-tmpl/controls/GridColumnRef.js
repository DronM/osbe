/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends GridColumn
 * @requires core/extend.js
 * @requires controls/GridColumn.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {Object} options
 */
function GridColumnRef(options){
	options = options || {};	
	
	var self = this;
	options.formatFunction = function(fields){
		return self.setCellValue();		
	}

	options.cellElements = [
		new Control(null,"A",{"href":"#"})
	];

	GridColumnRef.superclass.constructor.call(this,options);
}
extend(GridColumnRef,GridColumn);

/* Constants */


/* private members */
GridColumnRef.prototype.setCellValue = function(fields){
	var f = this.getField();
	if (!f.isNull()){
		var v = f.getValue();
		if (typeof(v)=="string"){
			//field of type string linked to Ref column
			v = CommonHelper.unserialize(v);
		}		
		return v.getDescr? v.getDescr():"";
	}
}

/* protected*/


/* public methods */

