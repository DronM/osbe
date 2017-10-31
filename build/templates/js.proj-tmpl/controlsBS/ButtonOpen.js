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
	
	options.glyph = options.glyph || "glyphicon-pencil";
	
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
extend(ButtonOpen,ButtonCtrl);

ButtonOpen.prototype.DEF_HINT = "открыть";
ButtonOpen.prototype.DEF_ALT = "откр.";
