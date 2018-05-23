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
	var ret;
	if (!v){
		ret = DateHelper.time();
	}
	else if (typeof v =="object"){
		ret = v;
	}
	else{
		ret = DateHelper.strtotime(v);
	}
	return ret;
}
