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
function GridRowDOCT(id,options){
	options = options || {};
	GridRowDOCT.superclass.constructor.call(this,
		id,options);
	this.addElement(new GridDbHeadCell(id+"_col_login_id",{
		"readBind":{"valueFieldId":"login_id"},"keyCol":true,
		"visible":false
		}));				
	this.addElement(new GridDbHeadCell(id+"_col_line_number",{"value":"№",
		"readBind":{"valueFieldId":"line_number"},"keyCol":true,
		"colAttrs":{"align":"center"}
		}));		
}
extend(GridRowDOCT,GridRow);