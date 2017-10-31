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
function ButtonExpToPDF(id,options){
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
	ButtonExpToPDF.superclass.constructor.call(
		this,id,options);
}
extend(ButtonExpToPDF,Button);

ButtonExpToPDF.prototype.DEF_IMAGE = "img/exp/to_pdf.png";
ButtonExpToPDF.prototype.DEF_HINT = "экспорт в PDF";
ButtonExpToPDF.prototype.DEF_ALT = "PDF";
ButtonExpToPDF.prototype.DEF_CLASS = "viewBtn";
ButtonExpToPDF.prototype.DEF_CAPTION="PDF";