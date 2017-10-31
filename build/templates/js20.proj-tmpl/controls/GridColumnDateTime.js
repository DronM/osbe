/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc
 
 * @extends GridColumnDate
 * @requires controls/GridColumnDate.js
 
 * @param {string} id - html tag id
 * @param {string} [options.dateFormat]
 */

function GridColumnDateTime(id,options){
	options = options || {};	
	
	this.m_dateFormat = options.dateFormat ||
		window.getApp().getDateTimeFormat() ||
		this.DEF_FORMAT;
	
	GridColumnDateTime.superclass.constructor.call(this,id,options);
}
extend(GridColumnDateTime,GridColumnDate);

/* Constants */

GridColumnDateTime.prototype.DEF_FORMAT = "d/m/Y H:i:s";

/* private members */

/* protected*/

