/* Copyright (c) 2014 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
*/

/* constructor */
function EditPeriodDate(id,options){
	options = options || {};
	
	var date_mask = options.editMask || "dd/mm/y";
	
	//from
	var d_opts = {};
	var dt = DateHandler.getStartOfDate(options.date || new Date());
	d_opts.value = DateHandler.dateToStr(dt,date_mask);
	d_opts.labelCaption = options.labelCaptionFrom || this.LABEL_FROM;
	d_opts.attrs = options.attrs || {};
	d_opts.attrs.required = d_opts.attrs.required || "required";	
	d_opts.contClassName = "edit_group_cont to_left";
	if ((options.enabled!=undefined&&!options.enabled)||d_opts.attrs.disabled=="disabled"){
		d_opts.attrs.disabled = "disabled";
	}
	options.controlFrom = new EditDate(id+"_from",d_opts);
	
	//to
	var d_opts = {};
	var dt = DateHandler.getEndOfDate(options.date || new Date());
	d_opts.value = DateHandler.dateToStr(dt,date_mask);
	d_opts.labelCaption = options.labelCaptionTo || this.LABEL_TO;	
	d_opts.attrs = options.attrs || {};
	d_opts.attrs.required = d_opts.attrs.required || "required";		
	d_opts.contClassName = "edit_group_cont to_left";
	if ((options.enabled!=undefined&&!options.enabled)||d_opts.attrs.disabled=="disabled"){
		d_opts.attrs.disabled = "disabled";
	}	
	options.controlTo = new EditDate(id+"_to",d_opts);
	
	EditPeriodDate.superclass.constructor.call(this,id,options);
}
extend(EditPeriodDate,EditPeriod);