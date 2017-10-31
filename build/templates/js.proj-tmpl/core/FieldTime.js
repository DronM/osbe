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
 * @requires core/ValidatorTime.js
*/

/* constructor */
function FieldTime(id,options){
	options = options || {};
	options.dataType=this.DT_TIME;
	options.validator = new ValidatorTime();
	FieldTime.superclass.constructor.call(this,id,options);
}
extend(FieldTime,Field);