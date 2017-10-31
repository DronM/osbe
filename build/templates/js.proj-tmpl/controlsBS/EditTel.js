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
function EditTel(id,options){
	options = options || {};
	options.validator = options.validator || new ValidatorCellPhone();
	options.editMask = options.editMask || this.DEF_EDIT_MASK;
	EditTel.superclass.constructor.call(this,id,options);
}
extend(EditTel,Edit);

/* constants */
EditTel.prototype.DEF_EDIT_MASK = '8-$d$d$d-$d$d$d-$d$d-$d$d';

/* public methods */