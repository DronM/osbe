/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends Field
 * @requires core/Field.js
 
 * @class
 * @classdesc
 
 * @param {string} id - Field identifier
 * @param {Object} options
 */
function FieldRef(id,options){

	options = options || {};
	
	FieldRef.superclass.constructor.call(this,id,options);
}
extend(FieldRef,Field);

FieldRef.prototype.setValue = function(key){

}
