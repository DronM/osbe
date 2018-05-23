/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2012

 * @extends FieldTime
 * @requires core/FieldTime.js
 
 * @class
 * @classdesc
 
 * @param {string} id - Field identifier
 * @param {Object} options
 */
function FieldInterval(id,options){
	options = options || {};
	options.dataType = this.DT_INTERVAL;
	FieldInterval.superclass.constructor.call(this,id,options);
}
extend(FieldInterval,FieldString);
