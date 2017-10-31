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
function EditPeriodFrom(id,options){
	options = options || {};
	var dt = DateHandler.getStartOfDate(options.date || new Date());
	options.editKalendarTime = DateHandler.dateToStr(dt,"hh:mmin:ss");
	options.value = DateHandler.dateToStr(dt,"dd/mm/y hh:mmin:ss");
	options.labelCaption = options.labelCaption || "Период с:";
	options.attrs = options.attrs || {};
	options.attrs.required = options.attrs.required || "required";
	
	EditPeriodFrom.superclass.constructor.call(this,id,options);
}
extend(EditPeriodFrom,EditDateTime);
