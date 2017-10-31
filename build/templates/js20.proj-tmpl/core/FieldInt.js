/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends Field
 * @requires core/Field.js
 * @requires core/ValidatorInt.js    
 
 * @class
 * @classdesc
 
 * @param {string} id - Field identifier
 * @param {namespace} options
 */
function FieldInt(id,options){
	options = options || {};
	options.validator = options.validator || new ValidatorInt(options);
	options.dataType = this.DT_INT;
	
	FieldInt.superclass.constructor.call(this,id,options);
}
extend(FieldInt,Field);
