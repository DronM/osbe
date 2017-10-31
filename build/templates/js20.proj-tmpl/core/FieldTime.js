/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc

 * @extends FieldDate
 * @requires core/FieldDate.js
 * @requires core/ValidatorTime.js
 
 * @param {string} id - Field identifier
 * @param {namespace} options
 */
function FieldTime(id,options){
	options = options || {};
	options.dataType = this.DT_TIME;

	options.validator = options.validator || new ValidatorTime(options);
	
	FieldTime.superclass.constructor.call(this,id,options);
}
extend(FieldTime,FieldDate);

FieldTime.prototype.XHR_FORMAT = "H:i:s";
