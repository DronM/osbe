/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends Validator
 * @requires core/Validator.js

 * @class
 * @classdesc
 
 * @param {Object} options
 */
function ValidatorBool(options){
	
	this.TRUE_VALS = [];

	ValidatorBool.superclass.constructor.call(this,options);
	
	this.TRUE_VALS.push("1");
	this.TRUE_VALS.push("true");
	this.TRUE_VALS.push("t");
	this.TRUE_VALS.push("yes");
	this.TRUE_VALS.push("y");
}
extend(ValidatorBool,Validator);

ValidatorBool.prototype.correctValue = function(v){
	return (v===null || v===undefined || v===true || v===false)?
		v : (
			(!isNaN(v)&&v>0)?
			true : (jQuery.inArray(v.toString().toLowerCase(),this.TRUE_VALS)>=0)
		)
	;
}
