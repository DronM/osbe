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
	options.tagName = options.tagName || "label";
	options.attrs = options.attrs || {};
	options.attrs["for"] = fieldId;
	options.caption = caption;
	options.id = "label"+fieldId;
	LabelField.superclass.constructor.call(
	this,options);
}
extend(LabelField,Label);