/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends FieldDate
 * @requires core/FieldDate.js
 
 * @class
 * @classdesc
 
 * @param {string} id - Field identifier
 * @param {Object} options
 */
function FieldDateTime(id,options){
	options = options || {};
	options.dataType = options.dataType || this.DT_DATETIME;

	FieldDateTime.superclass.constructor.call(this,id,options);
}
extend(FieldDateTime,FieldDate);

FieldDateTime.prototype.XHR_FORMAT = "Y-m-dTH:i:s";
