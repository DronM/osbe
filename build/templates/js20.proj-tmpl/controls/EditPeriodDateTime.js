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
function EditPeriodDateTime(id,options){
	options = options || {};	
	options.editClass = EditDateTime;
	
	EditPeriodDateTime.superclass.constructor.call(this,id,options);
}
extend(EditPeriodDateTime,EditPeriodDate);

/* Constants */


/* private members */

/* protected*/


/* public methods */

