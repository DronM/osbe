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
	options.image = options.image ||
		{"src":this.DEF_IMAGE,"alt":this.DEF_ALT};
	options.attrs = options.attrs || {};
	options.attrs.title = options.attrs.title ||
		this.DEF_HINT;
	options.onClick = options.onClick || 
			function(event){
				event = EventHandler.fixMouseEvent(event);
				var node = event.target.parentNode.parentNode.previousSibling;
				if (node){
					node.value = "";
				}
				if (options.editControl){
					var ctrl = options.editControl;
					if (ctrl){
						var mask = ctrl.getEditMask();
						if (mask){
							MaskEdit(ctrl.getNode(),mask);
						}
					}
				}
			};

	ButtonClear.superclass.constructor.call(
		this,id,options);
}
extend(ButtonClear,Button);

ButtonClear.prototype.DEF_IMAGE = "img/cat/cat_erase.png";
ButtonClear.prototype.DEF_HINT = "очистить значение";
ButtonClear.prototype.DEF_ALT = "оч.";