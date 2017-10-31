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
function GridRowDOC(id,options){
	options = options || {};
	GridRowDOC.superclass.constructor.call(this,
		id,options);	
		
	this.addElement(new GridDbHeadCell(id+"_col_id",{"value":"Код",
		"readBind":{"valueFieldId":"id"},"keyCol":true,"visible":false
		}));
	/*
	this.addElement(new GridDbHeadCell(id+"_col_processed",{"value":"",
		"readBind":{"valueFieldId":"processed"},
		"assocImageArray":{
			"true":this.STATE_PRCESSED,
			"false":this.STATE_UNPRCESSED
			}
		}));
	*/
	this.addElement(new GridDbHeadCell(id+"_col_date_time_descr",{"value":"Дата",
		"readBind":{"valueFieldId":"date_time_descr"},"descrCol":true,
		"sortable":true,"sort":"asc"
		}));
	this.addElement(new GridDbHeadCell(id+"_col_number",{"value":"Номер",
		"readBind":{"valueFieldId":"number"},"descrCol":true,
		"colAttrs":{"align":"center"},
		"sortable":true
		}));		
}
extend(GridRowDOC,GridRow);

GridRowDOC.prototype.STATE_PRCESSED = "img/doc/processed.png";
GridRowDOC.prototype.STATE_UNPRCESSED = "img/doc/unprocessed.png";