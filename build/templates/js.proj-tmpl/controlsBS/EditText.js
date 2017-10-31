/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
  * @requires controls/Edit.js
*/

/* constructor */
function EditText(id,options){
	options = options || {};
	options.inputType = this.DEF_INPUT_TYPE;
	EditText.superclass.constructor.call(this,id,options);
	this.setRows(options.rows || this.DEF_ROWS);
}
extend(EditText,Edit);

/* constants */
EditText.prototype.DEF_TAG_NAME = 'textarea';
EditText.prototype.DEF_ROWS = "5";

EditText.prototype.setRows = function(rows){
	DOMHandler.setAttr(this.m_node,"rows",rows);
}
EditText.prototype.getRows = function(){
	return DOMHandler.getAttr(this.m_node,"rows");
}
