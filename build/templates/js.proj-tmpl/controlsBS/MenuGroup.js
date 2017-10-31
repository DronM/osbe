/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
*/

/* constructor */
function MenuGroup(options){
	options =  options || {};
	options.className = options.className || this.DEF_CLASS_NAME;
	var tagName = options.tagName || this.DEF_TAG_NAME;
	MenuGroup.superclass.constructor.call(
		this,null,tagName,options);
}
extend(MenuGroup,ControlContainer);

MenuGroup.prototype.DEF_TAG_NAME = 'ul';
MenuGroup.prototype.DEF_CLASS_NAME = 'menu';