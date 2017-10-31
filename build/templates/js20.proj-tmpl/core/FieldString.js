/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2012

 * @extends Field
 * @requires core/Field.js
 * @requires core/ValidatorString.js    
 * @class
 * @classdesc
 
 * @param {string} id - Field identifier
 * @param {Object} options
 */
function FieldString(id,options){
	options = options || {};
	options.validator = options.validator || new ValidatorString(options);
	options.dataType = this.DT_STRING;
	
	FieldString.superclass.constructor.call(this,id,options);
}
extend(FieldString,Field);
