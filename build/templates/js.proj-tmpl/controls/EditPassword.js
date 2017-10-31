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
function EditPassword(id,options){
	options = options || {};
	options.inputType = this.DEF_INPUT_TYPE;
	EditPassword.superclass.constructor.call(this,id,options);
}
extend(EditPassword,Edit);

/* constants */
EditPassword.prototype.DEF_INPUT_TYPE = 'password';