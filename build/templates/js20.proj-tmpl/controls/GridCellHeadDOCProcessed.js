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
function GridCellHeadDOCProcessed(id,options){
	options = options || {};	
	
	options.value = " ",
	options.className = window.getBsCol(1),
	options.columns = [
		new GridColumn("processed",{
			"field":options.model.getField("processed"),
			"assocClassList":{"true":"glyphicon glyphicon-check","false":"glyphicon glyphicon-unchecked"}
		})
	];	
	
	GridCellHeadDOCProcessed.superclass.constructor.call(this,id,options);
}
extend(GridCellHeadDOCProcessed,GridCellHead);

/* Constants */


/* private members */

/* protected*/


/* public methods */

