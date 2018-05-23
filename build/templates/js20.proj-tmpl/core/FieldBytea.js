/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends Field
 * @requires core/Field.js
 * @requires core/ValidatorBool.js
 
 * @class
 * @classdesc
 
 * @param {string} id - Field identifier
 * @param {Object} options
 */
function FieldBytea(id,options){
	options = options || {};
	options.validator = options.validator || new Validator(options);
	options.dataType = this.DT_BYTEA;
	
	FieldBytea.superclass.constructor.call(this,id,options);
}
extend(FieldBytea,Field);
