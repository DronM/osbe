/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
  * @requires controls/Control.js
*/

/* constructor */
function EditRadio(id,options){
	options = options || {};
	options.inputType="radio";	
	if (options.descr){
		options.labelCaption = options.descr;
		//new Label({"attrs":{"for":id,"value":options.descr}});
	}
	EditRadio.superclass.constructor.call(this,id,options);
}
extend(EditRadio,Edit);

/* constants */
/*
EditRadio.prototype.getId = function(){
	return this.getAttr("value");
}
EditRadio.prototype.setId = function(id){
	this.setAttr("value",id);
}
*/
EditRadio.prototype.getDecsr = function(){
	return this.getValue();
}

EditRadio.prototype.setDescr = function(value){
	//this.setValue(descr);
	if (this.m_node.childNodes && this.m_node.childNodes.length>0){
		this.m_node.childNodes[0].nodeValue = value;
	}
	else{
		this.m_node.appendChild(document.createTextNode(value));
	}	
}
