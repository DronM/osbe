/* Copyright (c) 2016 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
/** Requirements
 * @requires 
 * @requires core/extend.js  
*/

/* constructor
@param string id
@param object options{

}
*/
function HiddenKey(id,options){
	options = options || {};	
	
	options.visible = false;
	
	this.setValidator(options.validator);
	
	HiddenKey.superclass.constructor.call(this,id,"div",options);
}
extend(HiddenKey,Control);

/* Constants */
HiddenKey.prototype.VAL_INIT_ATTR = "initValue";

/* private members */
HiddenKey.prototype.m_formatFunction;

/* protected*/


/* public methods */
HiddenKey.prototype.setValidator = function(v){
	this.m_validator = v;
}
HiddenKey.prototype.getValidator = function(){
	return this.m_validator;
}

HiddenKey.prototype.setInitValue = function(val){
	this.setValue(val);
	this.setAttr(this.VAL_INIT_ATTR,this.getValue());
}

HiddenKey.prototype.getInitValue = function(val){
	return this.getAttr(this.VAL_INIT_ATTR);
}

HiddenKey.prototype.isNull = function(){
	var v = this.getValue();
	return (!v || v.length==0);
}
HiddenKey.prototype.getModified = function(){
	var v = this.getValue();
	return (this.getValue()!=this.getInitValue());
}
HiddenKey.prototype.getIsRef = function(){
	return false;
}
HiddenKey.prototype.setValid = function(v){
	return false;
}
HiddenKey.prototype.setValue = function(val){
	if (this.m_validator){
		val = this.m_validator.correctValue(val);
	}
	HiddenKey.superclass.setValue.call(this,val);
}

HiddenKey.prototype.getFormatFunction = function(){
	return this.m_formatFunction;
}
HiddenKey.prototype.setFormatFunction = function(v){
	this.m_formatFunction = v;
}
HiddenKey.prototype.getInputEnabled = function(){
	return this.getEnabled();
}
HiddenKey.prototype.setInputEnabled = function(v){
	this.setEnabled(v);
}
