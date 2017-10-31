/* Copyright (c) 2016 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
/** Requirements
 * @requires 
 * @requires core/extend.js  
*/

/* constructor
@param string id
@param object options{

}
*/
function GridColumnFloat(id,options){
	options = options || {};	
	
	this.m_precision = options.precision || this.DEF_PRECISION;
	GridColumnFloat.superclass.constructor.call(this,id,options);
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
