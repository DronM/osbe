/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
  * @requires controls/Label.js
*/

/* constructor */
function LabelField(fieldId,caption,options){
	options = options || {};
	options.tagName = options.tagName || "td";
	options.attrs = options.attrs || {};
	//options.attrs[this.FIELD_ID_ATTR] = fieldId;
	options.caption = caption;
	options.id = "label"+fieldId;
	LabelField.superclass.constructor.call(
	this,options);
}
extend(LabelField,Label);

//LabelField.prototype.FIELD_ID_ATTR = "for";