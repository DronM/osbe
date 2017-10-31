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
function ButtonClear(id,options){
	options = options || {};
	options.glyph = "glyphicon-remove";
	
	options.onClick = options.onClick || 
			function(event){
				//event = EventHandler.fixMouseEvent(event);
				//var node = nd(options.controlId);
				//var node = DOMHandler.getParentByTagName(event.target,"input");
				//var node = event.target.parentNode.parentNode.previousSibling;
				//if (node){
				//	node.value = "";
				//	node.focus();
				//}
				if (options.editControl){
					options.editControl.resetValue();
					/*
					var n = options.editControl.getNode();
					if (n){
						n.value = "";
						n.focus();
					}
					var mask = options.editControl.getEditMask();
					if (mask){
						MaskEdit(n,mask);
					}
					*/
				}				
			};

	ButtonClear.superclass.constructor.call(
		this,id,options);
}
extend(ButtonClear,ButtonCtrl);

ButtonClear.prototype.DEF_HINT = "очистить значение";
