/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends FieldString
 * @requires core/FieldString.js
 * @requires core/ValidatorEnum.js   
 
 * @class
 * @classdesc
 
 * @param {string} id - Field identifier
 * @param {Object} options
 */
function FieldEnum(id,options){
	options.dataType = this.DT_ENUM;
	options.validator = options.validator || new ValidatorEnum(options);
	options.dataType = this.DT_ENUM;
	
	FieldEnum.superclass.constructor.call(this,id,options);	
}
extend(FieldEnum,FieldString);

/*
FieldEnum.prototype.setValue = function(v){
	FieldEnum.superclass.setValue.call(this,v);
	
	if (this.m_value=="null"){
		this.m_value = null;
	}
}
*/
