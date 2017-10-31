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
function ValidatorInt(){
	ValidatorInt.superclass.constructor.call(this);
}
extend(ValidatorInt,Validator);
/* public methods */
ValidatorInt.prototype.isValid = function(val){
	return true;
}
ValidatorInt.prototype.validate = function(val){
	if (val!=undefined
	&& typeof val !="number"){
		return parseInt(val,10);
	}
	else{
		return val;
	}
}