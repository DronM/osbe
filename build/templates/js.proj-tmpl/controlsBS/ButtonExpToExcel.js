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
function ButtonExpToExcel(id,options){
	options = options || {};
	options.caption = options.caption||this.DEF_CAPTION;
	options.attrs = options.attrs || {};
	options.attrs.title = options.attrs.title ||
		this.DEF_HINT;
	ButtonExpToExcel.superclass.constructor.call(
		this,id,options);
}
extend(ButtonExpToExcel,ButtonCmd);

ButtonExpToExcel.prototype.DEF_HINT = "экспорт в Excel";
ButtonExpToExcel.prototype.DEF_CAPTION="Excel";