/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017
 
 * @extends Field
 * @requires core/Field.js
 * @requires core/ValidatorXML.js 
 
 * @class
 * @classdesc
 
 * @param {string} id - Field identifier
 * @param {namespace} options
 */
function FieldXML(id,options){
	options = options || {};
	options.validator = options.validator || new ValidatorXML(options);
	options.dataType = this.DT_XML;

	FieldXML.superclass.constructor.call(this,id,options);
}
extend(FieldXML,Field);
