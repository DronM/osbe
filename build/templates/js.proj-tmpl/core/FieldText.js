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
 * @requires core/ValidatorString.js
*/

/* constructor */
function FieldText(id,options){
	options = options || {};
	options.dataType=this.DT_TEXT;
	options.validator = new ValidatorString();
	FieldText.superclass.constructor.call(this,id,options);
}
extend(FieldText,Field);