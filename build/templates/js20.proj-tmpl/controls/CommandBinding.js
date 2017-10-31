/* Copyright (c) 2016 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
/** Requirements
 * @requires 
*/

/* constructor
@param object options{

}
*/
function CommandBinding(options){
	options = options || {};	
	
	this.m_control = options.control;
	this.m_field = options.field;
	this.m_fieldId = options.fieldId;
}

/* Constants */


/* private members */
CommandBinding.prototype.m_control;
CommandBinding.prototype.m_field;

/* protected*/


/* public methods */
CommandBinding.prototype.getControl = function(){
	return this.m_control;
}

CommandBinding.prototype.setControl = function(v){
	this.m_control = v;
}

CommandBinding.prototype.getField = function(){
	return this.m_field;
}

CommandBinding.prototype.setField = function(v){
	this.m_field = v;
}

CommandBinding.prototype.getFieldId = function(){
	return this.m_fieldId;
}

CommandBinding.prototype.setFieldId = function(v){
	this.m_fieldId = v;
}
