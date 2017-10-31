/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends ValidatorInt
 * @requires core/ValidatorInt.js

 * @class
 * @classdesc
 
 * @param {Object} options
 */

function ValidatorFloat(options){
	ValidatorFloat.superclass.constructor.call(this,options);
}
extend(ValidatorFloat,ValidatorInt);

/*
ValidatorFloat.prototype.validate = function(v){
	//if (isNaN(n)){
		//throw new Error(this.ER_INVALID);
	//}
	//v = parseFloat(v);
}
*/

ValidatorFloat.prototype.correctValue = function(v){		
	var sep = CommonHelper.getDecimalSeparator();
	if (sep!="."){
		v = String(v).replace(sep,".");
	}
	return parseFloat(v);
}
