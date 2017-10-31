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
function EditList(id,options){
	options = options || {};	
	
	this.m_editViewControl = options.editViewControl;
	
	this.m_grid = new GridClient(id+":grid",{
		"commandPanel":new EditListCommands(id+"_cmd",{}),
		"body":new GridBody(),
		"editControls":[options.editViewControl]
	});
	
	this.filterSign = options.filterSign;
	
	if (options.labelCaption){
		this.setLabel(new LabelField(this.getId(),
			options.labelCaption,
			{"className":options.labelClassName,
			"visible":this.getVisible(),
			"enabled":this.getEnabled(),
			"readOnly":this.getVisible()})
		);		
	}
	
	options.className = options.contClassName || this.DEF_CONT_CLASS;
	
	EditList.superclass.constructor.call(this,id,"div",options);
	
	
	this.m_editContClassName = options.editContClassName || ("input-group "+get_bs_col()+"8");
	
	//this.m_edit_container = new ControlContainer(uuid(),"div",{"className":this.m_editContClassName});
	//this.m_edit_container.addElement(this.m_grid);
	
}
extend(EditList,Control);

/* Constants */
EditList.prototype.DEF_CONT_CLASS = "form-group";

/* private members */

/* protected*/


/* public methods */

EditList.prototype.setLabel = function(label){
	this.m_label = label;
}
EditList.prototype.getLabel = function(){
	return this.m_label;
}

EditList.prototype.removeDOM = function(){
	if (this.m_label){
		this.m_label.removeDOM();
	}
	if (this.m_edit_container){
		this.m_edit_container.removeDOM();
	}
	
	EditList.superclass.removeDOM.call(this);
}

EditList.prototype.setFocus = function(){
	this.setFocused();
}

EditList.prototype.toDOM = function(parent){	
	
	EditList.superclass.toDOM.call(this,parent);
	
	if (this.m_label){
		this.m_label.toDOM(this.m_node);
	}
	
	this.m_edit_container = new ControlContainer(uuid(),"div",{"className":this.m_editContClassName});
	this.m_edit_container.addElement(this.m_grid);
	this.m_edit_container.toDOM(this.m_node);
}

EditList.prototype.resetValue = function(){	
	var b = this.m_grid.getBody();	
	b.clear();
	var rows = b.getNode().getElementsByTagName("tr");
	//for (var i=0;i<rows.length;i++){
	while(rows.length){
		DOMHandler.removeNode(rows[0]);
	}
}

EditList.prototype.getValue = function(){
	MULTY_FIELD_SEP = ";";
	var f_id = (this.m_editViewControl.getFieldId)? this.m_editViewControl.getFieldId():null;
	var b_n = this.m_grid.getBody().getNode();	
	var vals = [];
	for (var i=0;i<b_n.childNodes.length;i++){
		var cell = b_n.childNodes[i].cells[0];
		var v;
		if (f_id){
			v = cell.getAttribute(f_id);
		}
		else if (cell.childNodes.length){
			v = cell.childNodes[0].textContent;
		}
		vals.push(v);
	}
	if (vals.join(MULTY_FIELD_SEP)){
		//console.log("EditList.prototype.getValue="+vals.join(MULTY_FIELD_SEP));
	}
	return vals.join(MULTY_FIELD_SEP);	
}

EditList.prototype.getFieldValue = function(){
	return this.getValue();
}

EditList.prototype.serialize= function(o){
	
	var o = o||{};
	o.grid = this.m_grid.serialize();
	
	return EditList.superclass.serialize.call(this,o);
}
EditList.prototype.unserialize= function(str){
	var o = json2obj(str);
	if (o.grid){
		this.m_grid.unserialize(o.grid);	
	}
	
}

EditList.prototype.getValueAsObj = function(){
	return {
		"grid":this.m_grid.serialize()
	};
}

EditList.prototype.setValueFromObj= function(obj){

	if (obj.grid){
		this.m_grid.unserialize(obj.grid);
	}
}

