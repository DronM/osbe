/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends Field
 * @requires core/Field.js
 * @requires core/ValidatorString.js   
 
 * @class
 * @classdesc
 
 * @param {string} id - Field identifier
 * @param {Object} options
 */
function FieldGeomPoint(id,options){
	options = options || {};
	options.validator = options.validator || new ValidatorString(options);
	options.dataType = this.DT_GEOM_POINT;

	FieldGeomPoint.superclass.constructor.call(this,id,options);
}
extend(FieldGeomPoint,Field);
