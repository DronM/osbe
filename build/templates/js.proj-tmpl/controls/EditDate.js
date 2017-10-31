/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
  * @requires core/ValidatorDate.js  
  * @requires controls/Edit.js
  * @requires controls/ButtonKalendar.js    
  * @requires extra/JSLib/*.js
*/

/* constructor */
function EditDate(id,options){
	options = options || {};
	options.validator = options.validator || new ValidatorDate();
	options.editMask = options.editMask || this.DEF_EDIT_MASK;
	options.editKalendarMask = options.editKalendarMask || this.DEF_KALEND_MASK;
	options.attrs = options.attrs || {};
	options.attrs.size = options.attrs.size || this.DEF_SIZE;
	options.attrs.maxlength = options.attrs.maxlength || this.DEF_MAX_LENGTH;
	//if (options.value==undefined){
		//options.value = DateHandler.dateToStr(new Date(),options.editKalendarMask);
	//}
	
	if (options.noSelect==undefined
	||(options.noSelect!=undefined&&options.noSelect==false)
	){
		options.buttonSelect = options.buttonSelect ||
			new ButtonKalendar(id+'_btn_kal',{"datePattern":options.editKalendarMask});
	}
	EditDate.superclass.constructor.call(this,id,options);
}
extend(EditDate,Edit);

/* constants */
EditDate.prototype.DEF_EDIT_MASK = '$d$d/$d$d/$d$d';
EditDate.prototype.DEF_KALEND_MASK = 'dd/mm/y';
EditDate.prototype.DEF_SIZE = 6;
EditDate.prototype.DEF_MAX_LENGTH = 8;

/* public methods */