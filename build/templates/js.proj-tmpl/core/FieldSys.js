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
*/

/* constructor */
function FieldSys(id,value){
	FieldSys.superclass.constructor.call(this,id,{"value":value});
}
extend(FieldSys,Field);

FieldSys.prototype.isValid = function(){
	return true;
}