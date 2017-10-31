/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends Validator
 * @requires core/Validator.js

 * @class
 * @classdesc
 
 * @param {Object} options
 */

function ValidatorArray(options){
	ValidatorArray.superclass.constructor.call(this,options);
}
extend(ValidatorArray,Validator);

ValidatorArray.prototype.correctValue = function(v){
	return eval(v);
}
