/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires common/functions.js
 * @requires core/Validator.js
*/

/* constructor */
function ValidatorDateTime(){
	ValidatorDateTime.superclass.constructor.call(this);
}
extend(ValidatorDateTime,Validator);
/* public methods */
ValidatorDateTime.prototype.isValid = function(val){
	return true;
}