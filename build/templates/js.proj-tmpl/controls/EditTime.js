/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
  * @requires core/ValidatorTime.js  
  * @requires controls/Edit.js
  * @requires extra/JSLib/*.js
*/

/* constructor */
function EditTime(id,options){
	options = options || {};
	options.validator = options.validator || new ValidatorTime();
	options.editMask = options.editMask || this.DEF_EDIT_MASK;
	options.attrs.size = options.attrs.size || this.DEF_SIZE;
	options.attrs.maxlength = options.attrs.maxlength || this.DEF_MAX_LENGTH;	
	EditTime.superclass.constructor.call(this,id,options);
}
extend(EditTime,Edit);

/* constants */
EditTime.prototype.DEF_EDIT_MASK = '$d$d:$d$d:$d$d';
EditTime.prototype.DEF_SIZE = 8;
EditTime.prototype.DEF_MAX_LENGTH = 8;

/* public methods */