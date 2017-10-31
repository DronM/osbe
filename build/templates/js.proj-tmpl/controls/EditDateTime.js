/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
  * @requires core/ValidatorDateTime.js  
  * @requires controls/Edit.js
  * @requires controls/ButtonKalendar.js    
  * @requires extra/JSLib/*.js
*/

/* constructor */
function EditDateTime(id,options){
	options = options || {};
	options.validator = options.validator || new ValidatorDateTime();
	options.editMask = options.editMask || this.DEF_EDIT_MASK;
	options.editKalendarMask = options.editKalendarMask || this.DEF_KALEND_MASK;
	//if (options.value==undefined){
		//options.value = DateHandler.dateToStr(new Date(),options.editKalendarMask);
	//}
	
	if (options.buttonSelect==undefined &&
	(options.noKalendar==undefined || options.noKalendar===false)){
		options.buttonSelect=
			new ButtonKalendar(id+'_btn_kal',{"datePattern":options.editKalendarMask,"kaledTime":options.editKalendarTime});
	}
	EditDateTime.superclass.constructor.call(this,id,options);
}
extend(EditDateTime,EditDate);

/* constants */
EditDateTime.prototype.DEF_EDIT_MASK = '$d$d/$d$d/$d$d $d$d:$d$d:$d$d';
EditDateTime.prototype.DEF_KALEND_MASK = 'dd/mm/y hh:mmin:ss';
EditDateTime.prototype.DEF_SIZE = 15;
EditDateTime.prototype.DEF_MAX_LENGTH = 17;

/* public methods */