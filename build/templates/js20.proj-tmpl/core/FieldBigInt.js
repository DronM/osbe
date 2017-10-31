/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @extends Field
 * @requires core/Field.js
 * @requires core/ValidatorInt.js  
 
 * @class
 * @classdesc
 
 * @param {string} id - Field identifier
 * @param {Object} options
 */
function FieldBigInt(id,options){
	options = options || {};
	options.validator = options.validator || new ValidatorInt(options);
	options.dataType = this.DT_INT_BIG;
	
	FieldBigInt.superclass.constructor.call(this,id,options);
}
extend(FieldBigInt,Field);
