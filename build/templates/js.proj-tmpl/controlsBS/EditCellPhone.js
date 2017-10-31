/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
  * @requires core/ValidatorCellPhone.js  
  * @requires controls/Edit.js
  * @requires extra/JSLib/*.js
*/

/* constructor */
function EditCellPhone(id,options){
	options = options || {};
	options.validator = options.validator || new ValidatorCellPhone();
	options.editMask = options.editMask || this.DEF_EDIT_MASK;
	options.attrs = options.attrs||{};
	options.attrs.maxlength=options.attrs.maxlength||this.DEF_MAX_LEN;
	options.attrs.size=options.attrs.size||this.DEF_SIZE;
	EditCellPhone.superclass.constructor.call(this,id,options);
}
extend(EditCellPhone,EditString);

/* constants */
EditCellPhone.prototype.DEF_EDIT_MASK = "8-9$d$d-$d$d$d-$d$d-$d$d";
EditCellPhone.prototype.DEF_MAX_LEN = 15;
EditCellPhone.prototype.DEF_SIZE = 15;

/* public methods */