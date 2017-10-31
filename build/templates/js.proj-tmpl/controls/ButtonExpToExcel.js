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
	/*
	options.image = options.image ||
		{"src":this.DEF_IMAGE,"alt":this.DEF_ALT};
	*/
	options.caption = options.caption||this.DEF_CAPTION;
	options.attrs = options.attrs || {};
	options.attrs.title = options.attrs.title ||
		this.DEF_HINT;
	options.className = options.className||this.DEF_CLASS;
	ButtonExpToExcel.superclass.constructor.call(
		this,id,options);
}
extend(ButtonExpToExcel,Button);

ButtonExpToExcel.prototype.DEF_IMAGE = "img/exp/to_excel.png";
ButtonExpToExcel.prototype.DEF_HINT = "экспорт в Excel";
ButtonExpToExcel.prototype.DEF_ALT = "Excel";
ButtonExpToExcel.prototype.DEF_CLASS = "viewBtn";
ButtonExpToExcel.prototype.DEF_CAPTION="Excel";