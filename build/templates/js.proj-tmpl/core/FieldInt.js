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
 * @requires core/ValidatorInt.js
*/

/* constructor */
function FieldInt(id,options){
	options = options || {};
	options.dataType=this.DT_INT;
	options.validator = new ValidatorInt();
	FieldInt.superclass.constructor.call(this,id,options);
}
extend(FieldInt,Field);

FieldInt.prototype.correctValue = function(value){
	if (value!=undefined
	&& typeof value !="number"){
		var val = parseInt(value,10);
		return (isNaN(val))? "null":val;
	}
	else{
		return (value==undefined)? "null":value;
	}
}
