/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires common/functions.js
 * @requires core/Field.js
 * @requires core/ValidatorDate.js
 * @requires common/DateHandler.js
*/

/* constructor */
function FieldDate(id,options){
	options = options || {};
	options.dataType=this.DT_DATE;
	options.validator = new ValidatorDate();
	FieldDate.superclass.constructor.call(this,id,options);
}
extend(FieldDate,Field);
