/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires controls/EditString.js
*/

/* constructor
@param string id 
@param object options {
	@param string editMask
	@param App app
}
*/
function EditPhone(id,options){
	options = options || {};
	
	options.editMask = options.editMask || window.getApp().getPhoneEditMask();
	
	EditPhone.superclass.constructor.call(this,id,options);
}
extend(EditPhone,EditString);

/* constants */

/* public methods */
