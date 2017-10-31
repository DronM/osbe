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
 * @requires core/ValidatorBool.js
*/

/* constructor */
function FieldBool(id,options){
	options = options || {};
	options.dataType=this.DT_BOOL;
	options.validator = new ValidatorBool();
	FieldBool.superclass.constructor.call(this,id,options);
}
extend(FieldBool,Field);

FieldBool.prototype.correctValue = function(value){
	return value;
}