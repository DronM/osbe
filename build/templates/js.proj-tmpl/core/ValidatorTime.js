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
function ValidatorTime(){
	ValidatorTime.superclass.constructor.call(this);
}
extend(ValidatorTime,Validator);
/* public methods */
ValidatorTime.prototype.isValid = function(val){
	return true;
}