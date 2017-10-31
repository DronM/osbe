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
	options.inputType = 'checkbox';
	EditCheckBox.superclass.constructor.call(this,id
		,options);
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
	var edit_container_node = parent;
	if (this.m_label){		
		this.m_container = new Control(null,(this.m_tableLayout)? "tr":"div",
			{"className":this.DEF_CONT_CLASS}
		);
		this.m_container.toDOM(parent);
		if (this.m_labelAlign=="right"){
			this.m_label.toDOM(this.m_container.m_node);
		}
		var edit_container = new Control(null,(this.m_tableLayout)? "td":"div");
		edit_container.setVisible(this.getVisible());
		edit_container.setEnabled(this.getEnabled());
		edit_container.toDOM(this.m_container.m_node);		
		edit_container_node = edit_container.m_node;
	}
	else if (this.m_node.size
	&&edit_container_node
	&&edit_container_node.nodeName.toLowerCase()=="td"){
		var b_cnt = 0;
		if (this.m_buttons){
			b_cnt = this.m_buttons.getCount();
		}
		edit_container_node.style = "width:"+(this.m_node.size+b_cnt*2+6)+"ch;";
	}	
	
	EditCheckBox.superclass.toDOM.call(this,edit_container_node);	
	
	if (this.m_label&&this.m_labelAlign=="left"){
		this.m_label.toDOM(edit_container_node);
	}
	
	if (this.m_buttons&&!this.m_buttons.isEmpty()){
		this.m_buttons.toDOMAfter(this.m_node);
	}	
}
*/