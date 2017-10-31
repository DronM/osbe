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
function EditSelectOption(id,options){
	options = options || {};
	if (options.optionSelected!=undefined
	&&options.optionSelected==true){
		options.attrs = options.attrs || {};
		options.attrs[this.SELECT_ATTR_NAME] = this.SELECT_ATTR_NAME;
	}
	EditSelectOption.superclass.constructor.call(this,id,
		this.DEF_TAG_NAME,options);
	if (options.optionDescr){
		this.setOptionDescr(options.optionDescr);	
	}
	if (options.optionId){
		this.setOptionId(options.optionId);	
	}
	
	
}
extend(EditSelectOption,Control);

/* constants */
EditSelectOption.prototype.DEF_TAG_NAME = 'option';
EditSelectOption.prototype.SELECT_ATTR_NAME = 'selected';

EditSelectOption.prototype.getOptionId = function(){
	return this.getAttr("value");
}
EditSelectOption.prototype.setOptionId = function(id){
	this.setAttr("value",id);
}
EditSelectOption.prototype.getOptionDescr = function(){
	return this.getValue();
}
EditSelectOption.prototype.setOptionDescr = function(descr){
	this.setValue(descr);
}