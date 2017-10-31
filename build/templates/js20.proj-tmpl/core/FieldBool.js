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
function FieldBool(id,options){
	options = options || {};
	options.validator = options.validator || new ValidatorBool(options);
	options.dataType = this.DT_BOOL;
	
	FieldBool.superclass.constructor.call(this,id,options);
}
extend(FieldBool,Field);

FieldBool.prototype.getValueXHR = function(){
	return ( (this.getValue())? "1":"0" );
}
