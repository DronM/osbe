/* Copyright (c) 2015 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
*/

/* constructor */
function EditPeriodMonth(id,options){
	options = options || {};
	
	var date_mask = options.editMask || "dd/mm/y";
	var d = options.date || new Date();
	var dy = d.getFullYear();
	var dm = d.getMonth();
	
	//from
	var d_opts = {};
	var dt = DateHandler.getStartOfDate(DateHandler.getFirstDateOfMonth(dy,dm));
	d_opts.value = DateHandler.dateToStr(dt,date_mask);
	d_opts.labelCaption = options.labelCaptionFrom || this.LABEL_FROM;
	d_opts.attrs = options.attrs || {};
	d_opts.attrs.required = d_opts.attrs.required || "required";	
	if ((options.enabled!=undefined&&!options.enabled)||d_opts.attrs.disabled=="disabled"){
		d_opts.attrs.disabled = "disabled";
	}	
	options.controlFrom = new EditDate(id+"_from",d_opts);
	
	//to
	var d_opts = {};
	var dt = DateHandler.getEndOfDate(DateHandler.getLastDateOfMonth(dy,dm));
	d_opts.value = DateHandler.dateToStr(dt,date_mask);
	d_opts.labelCaption = options.labelCaptionTo || this.LABEL_TO;	
	d_opts.attrs = options.attrs || {};
	d_opts.attrs.required = d_opts.attrs.required || "required";		
	if ((options.enabled!=undefined&&!options.enabled)||d_opts.attrs.disabled=="disabled"){
		d_opts.attrs.disabled = "disabled";
	}	
	options.controlTo = new EditDate(id+"_to",d_opts);
	
	EditPeriodMonth.superclass.constructor.call(this,id,options);
}
extend(EditPeriodMonth,EditPeriod);