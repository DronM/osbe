/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires controls/ViewList.js
*/

/* constructor */
function GridFilterDocument(id,options){
	options = options || {};
	GridFilterDocument.superclass.constructor.call(this,
		id,options);	
	this.addFilterControl(new EditPeriodFrom(id+"_filter_date_from"),
		{"sign":"ge","valueFieldId":"date_time"}
	);	
	this.addFilterControl(new EditPeriodTo(id+"_filter_date_to"),
		{"sign":"le","valueFieldId":"date_time"}
	);

}
extend(GridFilterDocument,GridFilter);