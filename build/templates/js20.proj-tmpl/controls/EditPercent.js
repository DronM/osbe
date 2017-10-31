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
function EditPercent(id,options){
	options = options || {};
	
	options.editMask = options.editMask || this.DEF_MASK;
	
	EditPercent.superclass.constructor.call(this,id,options);
}
extend(EditPercent,EditString);

/* constants */
EditPercent.prototype.DEF_MASK = "99%";


/* public methods */
