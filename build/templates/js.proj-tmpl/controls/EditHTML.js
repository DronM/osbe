/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
  * @requires controls/Control.js
  * @requires extra/CKEditor/ckeditor.js  
*/

/* constructor */
function EditHTML(id,options){
	EditHTML.superclass.constructor.call(this,id,this.TAG_NAME);
}
extend(EditHTML,Control);

/* constants */
EditHTML.prototype.TAG_NAME = 'div';

EditHTML.prototype.toDOM = function(parent){
	EditHTML.superclass.toDOM.call(this,parent);
	CKEDITOR.replace(this.getId(),{});
}