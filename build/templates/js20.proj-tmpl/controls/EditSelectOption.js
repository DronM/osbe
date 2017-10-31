/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2012
 
 * @class
 * @classdesc Select option control
 
 * @requires core/extend.js
 * @requires core/Control.js
  
 * @param {string} id
 * @param {namespace} options
 * @param {bool} [options.checked=false]
 * @param {string} options.value option id
 * @param {string} options.descr option description
 */
function EditSelectOption(id,options){
	options = options || {};
	if (options.checked != undefined && options.checked == true){
		options.attrs = options.attrs || {};
		options.attrs.selected = "selected";
	}
	
	EditSelectOption.superclass.constructor.call(this,id, (options.tagName||this.DEF_TAG_NAME), options);
	
	if (options.descr){
		this.setDescr(options.descr);	
	}
}
extend(EditSelectOption,Control);

/* constants */
EditSelectOption.prototype.DEF_TAG_NAME = "option";

EditSelectOption.prototype.getValue = function(){
	return this.getAttr("value");
}
EditSelectOption.prototype.setValue = function(id){
	this.setAttr("value",id);
}
EditSelectOption.prototype.getDescr = function(){
	return this.getText();
}
EditSelectOption.prototype.setDescr = function(descr){
	this.setText(descr);
}
