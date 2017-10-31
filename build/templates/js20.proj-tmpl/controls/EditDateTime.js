/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires core/ValidatorDateTime.js  
  * @requires controls/EditDate.js
*/

/* constructor
	editMask
	dateFormat
	selectTimeValueStr
*/
function EditDateTime(id,options){
	options = options || {};
	
	options.validator = options.validator || new ValidatorDateTime(options);
	options.editMask = options.editMask || window.getApp().getDateTimeEditMask();
	options.dateFormat = options.dateFormat || window.getApp().getDateTimeFormat();
	//options.editContClassName = options.editContClassName || "input-group "+options.app.getBsCol()+"4";
	
	EditDateTime.superclass.constructor.call(this,id,options);
}
extend(EditDateTime,EditDate);

/* constants */

/* public methods */
