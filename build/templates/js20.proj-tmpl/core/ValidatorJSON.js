/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends Validator
 * @requires core/extend.js 
 * @requires core/Validator.js

 * @class
 * @classdesc
 
 * @param {Object} options
 */

function ValidatorJSON(options){
	ValidatorJSON.superclass.constructor.call(this,options);
}
extend(ValidatorJSON,Validator);

ValidatorJSON.prototype.correctValue = function(v){
	return CommonHelper.unserialize(v);//eval
}
