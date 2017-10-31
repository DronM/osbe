/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/

/** Requirements
  * @requires core/extend.js
  * @requires controls/Edit.js
*/

/* constructor
@param string id 
@param object options {
	@param  string inputType Default DEF_INPUT_TYPE
}
*/
function EditPassword(id,options){
	options = options || {};
	
	options.cmdClear = (options.cmdClear==undefined)? false:options.cmdClear;	
	
	EditPassword.superclass.constructor.call(this,id,options);
}
extend(EditPassword,EditString);

/* constants */
EditPassword.prototype.DEF_INPUT_TYPE = "password";

EditPassword.prototype.getModified = function(){
	var v = this.getValue();
	return (v && v.length);
}

