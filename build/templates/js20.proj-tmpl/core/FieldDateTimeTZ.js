/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends FieldDateTime
 * @requires core/FieldDateTime.js
 
 * @class
 * @classdesc
 
 * @param {string} id - Field identifier
 * @param {Object} options
 */
function FieldDateTimeTZ(id,options){
	options = options || {};
	options.dataType = this.DT_DATETIMETZ;
	
	FieldDateTimeTZ.superclass.constructor.call(this,id,options);
}
extend(FieldDateTimeTZ,FieldDateTime);
