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
function ValidatorDate(){
	ValidatorDate.superclass.constructor.call(this);
}
extend(ValidatorDate,Validator);
/* public methods */
ValidatorDate.prototype.isValid = function(val){
	return true;
}