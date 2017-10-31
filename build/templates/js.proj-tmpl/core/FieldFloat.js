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
 * @requires core/ValidatorFloat.js
*/

/* constructor */
function FieldFloat(id,options){
	options = options || {};
	options.dataType=this.DT_FLOAT;
	options.validator = new ValidatorFloat();
	FieldFloat.superclass.constructor.call(this,id,options);
}
extend(FieldFloat,Field);

/* protected */
/*
FieldFloat.prototype.correctValue = function(value){

	var res = value.replace(",",".");
	if (res="NaN"){
		res = 0;
	}
	res = parseFloat(res);
	return res;

}
*/
