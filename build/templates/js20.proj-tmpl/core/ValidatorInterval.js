/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends ValidatorTime
 * @requires core/ValidatorTime.js

 * @class
 * @classdesc
 
 * @param {Object} options
 */

function ValidatorInterval(options){
	ValidatorInterval.superclass.constructor.call(this,options);
}
extend(ValidatorInterval,ValidatorTime);
