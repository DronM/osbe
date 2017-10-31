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
function GridCellHeadDOCDate(id,options){
	options = options || {};	
	
	options.value = "Дата",
	options.sortable = true;
	options.sort = "asc";
	options.columns = [
		new GridColumnDate("date_time",{"field":options.model.getField("date_time"),"dateFormat":window.getApp().getJournalDateFormat()})
	];	
	
	GridCellHeadDOCDate.superclass.constructor.call(this,id,options);
}
extend(GridCellHeadDOCDate,GridCellHead);

/* Constants */


/* private members */

/* protected*/


/* public methods */

