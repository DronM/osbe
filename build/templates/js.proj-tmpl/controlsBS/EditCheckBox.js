/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
  * @requires controls/Edit.js
*/

/* constructor */
function EditCheckBox(id,options){
	options = options || {};
	options.inputType = "checkbox";
	
	options.labelClassName = options.labelClassName||
		("control-label "+(get_bs_col()+"11"));
	
	options.editContClassName = "input-group "+get_bs_col()+"1";
	
	EditCheckBox.superclass.constructor.call(this,id,options);
	
	if (options.checked){
		this.setChecked(options.checked);
	}
	
	this.m_labelAlign = options.labelAlign||"right";	
}
extend(EditCheckBox,Edit);

/* constants */

/* public methods */
EditCheckBox.prototype.setChecked = function(checked){
	this.m_node.checked = checked;
}
EditCheckBox.prototype.getChecked = function(){
	return this.m_node.checked;
}
EditCheckBox.prototype.getValue = function(){
	return (this.m_node.checked)? "true":"false";
}
EditCheckBox.prototype.setValue = function(val){
	this.setChecked((val=="true"));
}
/*
EditCheckBox.prototype.toDOM = function(parent){	
	
	this.m_container = new Control(uuid(),"div",{"className":"checkbox"});
	this.m_container.toDOM(parent);
	var edit_container_node;
	
	if (this.m_label){				
		this.m_label.toDOM(this.m_container.m_node);
		edit_container_node = this.m_label.getNode();
	}
	else{
		edit_container_node = this.m_container.getNode();
	}
	
	//EditCheckBox.superclass.toDOM.call(this,edit_container_node);	
	
}
*/
EditCheckBox.prototype.DEF_CLASS = "checkbox";
