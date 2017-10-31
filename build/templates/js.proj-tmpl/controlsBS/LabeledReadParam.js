/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
*/

/* constructor */
function LabeledReadParam(id,options){
	options = options || {};
	options.attrs = options.attrs || {};
	options.attrs.type = "text";
	options.disabled = "disabled";
	options.size = this.DEF_SIZE;//default
	
	LabeledReadParam.superclass.constructor.call(this,
		id,"input",options);		
		
	this.m_label = new Label({"attrs":{"id":id+"_l","for":id},
	"caption":options.labelText});	
		
	if (options.afterLabelText){
		this.m_afterLabel = new Control(id+"_lafter","span",
		{"value":options.afterLabelText});
	}
}
extend(LabeledReadParam,Control);

LabeledReadParam.prototype.DEF_SIZE = 2;

LabeledReadParam.prototype.m_afterLabel;
LabeledReadParam.prototype.m_label;

LabeledReadParam.prototype.toDOM() = function(parent){
	/*
	this.m_label.toDOM(parent);

	LabeledReadParam.superclass.toDOM.call(this,parent);
	
	this.m_afterLabel.toDOM(parent);	
	*/
}

LabeledReadParam.prototype.removeDOM() = function(){
	this.m_label.removeDOM();

	LabeledReadParam.superclass.toDOM.removeDOM(this);
	
	this.m_afterLabel.removeDOM();	
}
LabeledReadParam.prototype.setValue = function(value){
	this.m_node.value = value;
}
