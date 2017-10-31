/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2012

 * @extends FieldString
 * @requires core/FieldString.js
 
 * @class
 * @classdesc
 
 * @param {string} id - Field identifier
 * @param {Object} options
 */
function FieldText(id,options){
	options = options || {};
	options.dataType = this.DT_TEXT;

	FieldText.superclass.constructor.call(this,id,options);
}
extend(FieldText,FieldString);
