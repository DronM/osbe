/* Copyright (c) 2014 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
*/

/* constructor */
function EditPeriod(id,options){
	options = options || {};
	var tagName = options.tagName||this.DEF_TAG_NAME;
	EditPeriod.superclass.constructor.call(this,id,tagName,options);
	
	this.setControlFrom(options.controlFrom);
	this.setControlTo(options.controlTo);	
}
extend(EditPeriod,ControlContainer);

/* Constants*/
EditPeriod.prototype.DEF_TAG_NAME = "div";
EditPeriod.prototype.LABEL_FROM = "Период с:";
EditPeriod.prototype.LABEL_TO = "по:";

/* private members*/
EditPeriod.prototype.m_controlFrom;
EditPeriod.prototype.m_controlTo;

EditPeriod.prototype.setControlFrom = function(ctrl){
	this.m_controlFrom = ctrl;
}
EditPeriod.prototype.getControlFrom = function(){
	return this.m_controlFrom;
}
EditPeriod.prototype.setControlTo = function(ctrl){
	this.m_controlTo = ctrl;
}
EditPeriod.prototype.getControlTo = function(){
	return this.m_controlTo;
}