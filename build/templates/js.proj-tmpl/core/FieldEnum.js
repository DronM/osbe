/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires common/functions.js
 * @requires core/Field.js
*/

/* constructor */
function FieldEnum(id,options){
	options = options || {};	
	FieldEnum.superclass.constructor.call(this,id);
	if (options.values){
		this.m_values = options.values;
	}
}
extend(FieldEnum,Field);

FieldEnum.prototype.m_values;

FieldEnum.prototype.isValid = function(){
	return true;
}