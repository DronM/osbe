/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
/** Requirements
  * @requires core/extend.js
  * @requires controls/Control.js
  * @requires extra/CKEditor/ckeditor.js  
*/

/* constructor
@param string id
@param object options{
	@param string tagName Default TAG_NAME
}
*/
function EditHTML(id,options){
	EditHTML.superclass.constructor.call(this,id,options.tagName || this.TAG_NAME);
}
extend(EditHTML,Control);

/* constants */
EditHTML.prototype.TAG_NAME = "div";

EditHTML.prototype.toDOM = function(parent){
	EditHTML.superclass.toDOM.call(this,parent);
	CKEDITOR.replace(this.getId(),{});
}
