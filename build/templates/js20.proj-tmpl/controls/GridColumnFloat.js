/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 * @class
 * @classdesc Grid column Float class class
 
 * @extends GridColumn
 
 * @requires core/extend.js
 * @requires controls/GridColumn.js
 
 * @param {object} options
 * @param {int} [options.precision=DEF_PRECISION]
 */
function GridColumnFloat(options){
	options = options || {};	
	
	this.m_precision = options.precision || this.DEF_PRECISION;
	GridColumnFloat.superclass.constructor.call(this,options);
}
extend(GridColumnFloat,GridColumn);

/* Constants */
GridColumnFloat.prototype.DEF_PRECISION = 2;
GridColumnFloat.prototype.DEF_SEPAR = " ";

/* private members */

/* protected*/


/* public methods */
GridColumnFloat.prototype.formatVal = function(v){
	//var n = v;
	//n = CommonHelper.numberFormat(v, this.m_precision, CommonHelper.getDecimalSeparator(), this.DEF_SEPAR);
	if (isNaN(v)){
		return "";
	}
	else{
		return CommonHelper.numberFormat(v, this.m_precision, CommonHelper.getDecimalSeparator(), this.DEF_SEPAR);
	}
	
}
