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
function EditSelect(id,options){
	options = options || {};
	
	options.className = options.className || this.DEF_CLASS;
	EditSelect.superclass.constructor.call(this,id,
		this.DEF_TAG_NAME,options);
		
	if (options.label){
		this.setLabel(options.label);
	}
	else if (options.labelCaption){
		this.setLabel(new LabelField(this.getId(),options.labelCaption,
			{"visible":this.getVisible(),
			"enabled":this.getEnabled(),
			"tagName":(this.m_tableLayout)? "td":"div",
			"readOnly":this.getVisible()}
		));
	}
	this.m_buttons = new ControlContainer(this.getId()+this.BTNS_CONTAINER_ID,
		"div",{"className":this.BTNS_CONTAINER_CLASS,
			"visible":this.getVisible(),
			"enabled":this.getEnabled(),
			"readOnly":this.getVisible()
			}
		);
	
	this.m_tableLayout = (options.tableLayout==undefined)? true:options.tableLayout;	
}
extend(EditSelect,ControlContainer);

EditSelect.prototype.m_label;
EditSelect.prototype.m_buttons;

/* constants */
EditSelect.prototype.DEF_TAG_NAME = 'select';
EditSelect.prototype.DEF_CLASS = "ctrlEdit";
EditSelect.prototype.DEF_CONT_CLASS = "edit_group_cont";
EditSelect.prototype.DEF_EDIT_CONT_CLASS = "edit_cont";
EditSelect.prototype.BTNS_CONTAINER_CLASS="btns_cont";

EditSelect.prototype.setLabel = function(label){
	this.m_label = label;
}
EditSelect.prototype.getLabel = function(){
	return this.m_label;
}
EditSelect.prototype.toDOM = function(parent){	
	var edit_container_node = parent;
	if (this.m_label){
		var r_tag,c_tag;
		if (this.m_tableLayout){
			r_tag = "tr";
			c_tag = "td";
		}
		else{
			r_tag = "div";
			c_tag = "div";		
		}
		this.m_container = new Control(null,r_tag,{"className":this.DEF_CONT_CLASS});
		this.m_container.toDOM(parent);
		this.m_label.toDOM(this.m_container.m_node);
		this.m_edit_container = new Control(null,c_tag,{"className":this.DEF_EDIT_CONT_CLASS});
		this.m_edit_container.toDOM(this.m_container.m_node);		
		edit_container_node = this.m_edit_container.m_node;
	}
	EditSelect.superclass.toDOM.call(this,edit_container_node);
	if (this.m_buttons && !this.m_buttons.isEmpty()){
		this.m_buttons.toDOMAfter(this.m_node);
	}
	
}
EditSelect.prototype.removeDOM = function(){
	if (this.m_container){
		this.m_container.removeDOM();
	}
	if (this.m_buttons){
		this.m_buttons.removeDOM();
	}
	EditSelect.superclass.removeDOM.call(this);
}

/*
EditSelect.prototype.getSelectedIndex = function(){
	return this.m_node.selectedIndex;
}
EditSelect.prototype.getSelectedDescr = function(){
	var ind = this.m_node.selectedIndex;
	if (ind>0){
		return this.m_node.options[ind].text;
	}
}
EditSelect.prototype.setSelectedByIndex = function(ind,selected){
	this.m_elements[ind].m_node.setSelected(selected);
}
*/
EditSelect.prototype.clear = function(){
	for (var elem_id in this.m_elements){
		DOMHandler.removeNode(this.m_elements[elem_id].m_node);
	}
	this.m_elements = {};
}

EditSelect.prototype.setById = function(id){
	this.setByFieldId(id);
}
EditSelect.prototype.setByIndex = function(ind){
	var i=0;
	for(var id in this.m_elements){
		if (i==ind){
			this.m_elements[id].m_node.selected="selected";
			this.m_elements[id].m_node.selectedIndex = ind;			
			break;
		}
		i++;
	}
}
EditSelect.prototype.setByFieldId = function(id){
	this.m_node.value = id;
	/*
	var i=0;
	for (var elem_id in this.m_elements){
		if (this.m_elements[elem_id].getOptionId()==id){
			this.m_node.selected="selected";
			this.m_node.selectedIndex = i;
			break;
		}
		i++;
	}			
	*/
}

EditSelect.prototype.setValue = function(value){
	this.setByFieldId(value);
}
/*
EditSelect.prototype.setAttr = function(name,val){
	EditSelect.superclass.setAttr.call(this,name,val);
	if (name.substring(0,5)=="fkey_"){
		//setting id
		this.setById(val);
	}	
}
*/
/*
EditSelect.prototype.getAttr = function(name){
	if (name.substr(0,5)=="fkey_"){
		if (this.m_node.selectedIndex>0){
			return this.m_node.options[this.m_node.selectedIndex].value;
		}
	}
	else{
		return DOMHandler.getAttr(this.m_node,name);
	}
}
*/
EditSelect.prototype.validate = function(val){
	return val;
}
EditSelect.prototype.getValue = function(){
	if (this.m_node.options && this.m_node.options.length
		&&this.m_node.selectedIndex>=0){
		return this.m_node.options[this.m_node.selectedIndex].value;
	}
}
EditSelect.prototype.setComment = function(com){
	if (this.m_comment==undefined){
		this.m_comment=new Control(this.getId()+"_comment_","span",{visible:true,"className":"ctrl_comment"});
		this.m_comment.toDOM(this.m_node.parentNode);
	}
	this.m_comment.setValue(com);
	this.m_comment.setVisible(true);	
}
EditSelect.prototype.getValueAsObj= function(){
	return {"value":this.getValue()};
}
EditSelect.prototype.setValueFromObj= function(obj){
	this.setByFieldId(obj.value);
}
EditSelect.prototype.setFocus = function(){
	this.m_node.focus();
}
EditSelect.prototype.resetValue = function(){
	this.setByIndex(0);
}

EditSelect.prototype.setVisible = function(visible){
	if (this.m_label){
		this.m_label.setVisible(visible);
		if (this.m_container){
			this.m_container.setVisible(visible);
		}
		if (this.m_edit_container){
			this.m_edit_container.setVisible(visible);
		}
	}
	if (this.m_buttons){
		this.m_buttons.setVisible(visible);
	}
	EditSelect.superclass.setVisible.call(this,visible);
}
EditSelect.prototype.getButtons = function(){
	return this.m_buttons;
}