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
 * @requires core/ValidatorDateTime.js
*/

/* constructor */
function FieldDateTime(id,options){
	options = options || {};
	options.dataType=this.DT_DATETIME;
	options.validator = new ValidatorDateTime();
	FieldDateTime.superclass.constructor.call(this,id,options);
}
extend(FieldDateTime,Field);
/*
FieldDate.prototype.getValueForQuery = function(){
	var add_zero = function(arg){
		var s = arg.toString();
		return ((s.length<2)? '0':'')+s;
	};
	var value = this.getValue();
	return value.getFullYear().toString()+'-'+
		add_zero(value.getMonth()+1)+'-'+
		add_zero(value.getDate())+' '+
		add_zero(value.getHours())+':'+
		add_zero(value.getMinutes())+':'+
		add_zero(value.getSeconds());
}
*/