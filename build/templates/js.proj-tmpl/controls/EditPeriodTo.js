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
function EditPeriodTo(id,options){
	options = options || {};
	
	var dt = DateHandler.getEndOfDate(options.date || new Date());
	options.editKalendarTime = DateHandler.dateToStr(dt,"hh:mmin:ss");
	options.value = DateHandler.dateToStr(dt,"dd/mm/y hh:mmin:ss");
	options.labelCaption = options.labelCaption || "Период по:";
	
	EditPeriodTo.superclass.constructor.call(this,id,options);
}
extend(EditPeriodTo,EditDateTime);
