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
function EditPeriodDateTime(id,options){
	options = options || {};

	var date_mask = "dd/mm/y";
	var time_mask = "hh:mmin:ss";
	
	//from	
	var d_opts = {};
	var dt = DateHandler.getStartOfDate(options.date || new Date());
	d_opts.editKalendarTime = DateHandler.dateToStr(dt,time_mask);
	d_opts.value = DateHandler.dateToStr(dt,date_mask+" "+time_mask);
	d_opts.labelCaption = options.labelCaptionFrom || this.LABEL_FROM;
	d_opts.attrs = options.attrs || {};
	d_opts.attrs.required = d_opts.attrs.required || "required";	
	d_opts.tableLayout = options.tableLayout;
	d_opts.contClassName = "edit_group_cont to_left";
	options.controlFrom = new EditDateTime(id+"_from",d_opts);
	
	//to
	var d_opts = {};
	var dt = DateHandler.getEndOfDate(options.date || new Date());
	d_opts.editKalendarTime = DateHandler.dateToStr(dt,time_mask);
	d_opts.value = DateHandler.dateToStr(dt,date_mask+" "+time_mask);
	d_opts.labelCaption = options.labelCaptionTo || this.LABEL_TO;
	d_opts.attrs = options.attrs || {};
	d_opts.attrs.required = d_opts.attrs.required || "required";		
	d_opts.tableLayout = options.tableLayout;
	d_opts.contClassName = "edit_group_cont to_left";
	options.controlTo = new EditDateTime(id+"_to",d_opts);
	
	EditPeriodDateTime.superclass.constructor.call(this,id,options);
}
extend(EditPeriodDateTime,EditPeriod);