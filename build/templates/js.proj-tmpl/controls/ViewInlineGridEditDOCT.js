/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires controls/View.js
*/

/* constructor */
function ViewInlineGridEditDOCT(id,options){
	options = options || {};
	ViewInlineGridEditDOCT.superclass.constructor.call(this,
		id,options);	
	this.addDataControl(
		new Edit(id+"login_id",
		{"attrs":{"value":0},"name":"login_id",
		"visible":false}),
		{"modelId":options.readModelId,
		"valueFieldId":"login_id",
		"keyFieldIds":null},
		{"valueFieldId":"login_id","keyFieldIds":null}
	);				
	this.addDataControl(
		new Edit(id+"_line_number",
		{"attrs":{"disabled":"disabled","value":0,"size":"3"},
		"name":"line_number"}),
		{"modelId":options.readModelId,
		"valueFieldId":"line_number",
		"keyFieldIds":null},
		{"valueFieldId":"line_number","keyFieldIds":null}
	);		
}
extend(ViewInlineGridEditDOCT,ViewInlineGridEdit);