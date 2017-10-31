/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends Validator
 * @requires core/Validator.js

 * @class
 * @classdesc
 
 * @param {Object} options
 */
function ValidatorDate(options){
	ValidatorDate.superclass.constructor.call(this,options);
}
extend(ValidatorDate,Validator);

ValidatorDate.prototype.correctValue = function(v){
	if (!v)return DateHelper.time();
	if (v instanceof Date) return v;
	return DateHelper.strtotime(v);
	//return new Date(v);
}
