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
function GridCellHeadDOCNumber(id,options){
	options = options || {};	
	
	options.value = "Номер",
	options.sortable = true;
	options.columns = [
		new GridColumn("number",{"field":options.model.getField("number")})
	];	
	
	GridCellHeadDOCNumber.superclass.constructor.call(this,id,options);
}
extend(GridCellHeadDOCNumber,GridCellHead);

/* Constants */


/* private members */

/* protected*/


/* public methods */

