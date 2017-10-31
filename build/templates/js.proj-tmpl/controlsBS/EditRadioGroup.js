/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
  * @requires controls/ControlContainer.js
*/

/* constructor */
function EditRadioGroup(id,options){
	options = options || {};
	EditRadioGroup.superclass.constructor.call(this,id,
		options.tagName||this.DEF_TAG_NAME,options);
	if (options.label){
		this.setLabel(options.label);
	}
	else if (options.labelCaption){
		var tagName = (options.tableLayout==undefined||options.tableLayout)?
				"td":"div";
		this.setLabel(new LabelField(
			this.getId(),
			options.labelCaption,{"tagName":tagName}
			)
		);
	}	
}
extend(EditRadioGroup,ControlContainer);

EditSelect.prototype.m_label;

/* constants */
EditRadioGroup.prototype.DEF_TAG_NAME = 'div';
EditRadioGroup.prototype.DEF_CLASS = "ctrlEdit";
EditRadioGroup.prototype.setLabel = function(label){
	this.m_label = label;
}
EditRadioGroup.prototype.getLabel = function(){
	return this.m_label;
}

EditRadioGroup.prototype.toDOM = function(parent){
	if (this.m_label){
		this.m_label.toDOM(parent);
	}
	EditRadioGroup.superclass.toDOM.call(this,parent);
}
EditRadioGroup.prototype.clear = function(){
	for (var elem_id in this.m_elements){
		DOMHandler.removeNode(this.m_elements[elem_id].m_node);
	}
	this.m_elements = {};
}
EditRadioGroup.prototype.setValue = function(value){
	for (var elem_id in this.m_elements){
		if (this.m_elements[elem_id].m_node.nodeName.toLowerCase()=="input"
		&& this.m_elements[elem_id].m_node.value==value){
			this.m_elements[elem_id].m_node.checked=true;
		}
	}
}
EditRadioGroup.prototype.getCheckedValue = function(){
	for (var elem_id in this.m_elements){
		if (this.m_elements[elem_id].m_node.nodeName.toLowerCase()=="input"
		&& this.m_elements[elem_id].m_node.checked){
			return this.m_elements[elem_id].m_node.value;
		}
	}		
}

EditRadioGroup.prototype.getValue = function(){
	return this.getCheckedValue();
}

EditRadioGroup.prototype.getAttr = function(name){
	if (name.substr(0,5)=="fkey_"){
		return this.getCheckedValue();
	}
	else{
		return DOMHandler.getAttr(this.m_node,name);
	}
}

EditRadioGroup.prototype.resetValue = function(){
	for (var id in this.m_elements){
		this.m_elements[id].resetValue();
	}
}

