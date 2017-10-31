/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends ValidatorDate
 * @requires core/ValidatorDate.js

 * @class
 * @classdesc
 
 * @param {Object} options
 */
function ValidatorDateTime(options){
	ValidatorDateTime.superclass.constructor.call(this,options);
}
extend(ValidatorDateTime,ValidatorDate);

