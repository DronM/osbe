/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
  * @requires common/EventHandler.js
  * @requires controls/Button.js
*/

/* constructor */
function ButtonOpen(id,options){
	options = options || {};
	options.image = options.image ||
		{"src":this.DEF_IMAGE,"alt":this.DEF_ALT};
	options.attrs = options.attrs || {};
	options.attrs.title = options.attrs.title ||
		this.DEF_HINT;
	options.onClick = options.onClick || 
			function(event){
				event = EventHandler.fixMouseEvent(event);
				alert(event.value);
			};

	ButtonOpen.superclass.constructor.call(
		this,id,options);
}
extend(ButtonOpen,Button);

ButtonOpen.prototype.DEF_IMAGE = "img/cat/cat_edit.png";
ButtonOpen.prototype.DEF_HINT = "открыть";
ButtonOpen.prototype.DEF_ALT = "откр.";