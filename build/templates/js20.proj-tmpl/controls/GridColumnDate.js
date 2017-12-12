/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends GridColumn
 * @requires controls/GridColumn.js
 * @requires core/AppWin.js 

 * @class
 * @classdesc

 * @param {string||namespace} id depricated syntax. new syntax - with options as the first parameter!
 * @param {object} options
 * @param {string} options.dateFormat
 */
function GridColumnDate(options){
	options = options || {};	
	
	this.m_dateFormat =
		options.dateFormat ||
		window.getApp().getDateFormat() ||
		this.DEF_FORMAT;
	
	GridColumnDate.superclass.constructor.call(this,options);
}
extend(GridColumnDate,GridColumn);

/* Constants */

GridColumnDate.prototype.DEF_FORMAT = "d/m/Y";

/* private members */

/* protected*/


/* public methods */
GridColumnDate.prototype.formatVal = function(v){
	return (v)? DateHelper.format(v, this.m_dateFormat):"";
}
