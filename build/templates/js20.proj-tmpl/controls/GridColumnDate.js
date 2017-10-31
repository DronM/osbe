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
function GridColumnDate(id,options){
	options = options || {};	
	
	this.m_dateFormat =
		options.dateFormat ||
		window.getApp().getDateFormat() ||
		this.DEF_FORMAT;
	
	GridColumnDate.superclass.constructor.call(this,id,options);
}
extend(GridColumnDate,GridColumn);

/* Constants */

GridColumnDate.prototype.DEF_FORMAT = "d/m/Y";

/* private members */

/* protected*/


/* public methods */
GridColumnDate.prototype.formatVal = function(v){
	return DateHelper.format(v, this.m_dateFormat);
}
