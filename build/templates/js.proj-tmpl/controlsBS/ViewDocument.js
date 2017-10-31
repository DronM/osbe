/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires controls/ViewDialog.js
*/

/* constructor */
function ViewDocument(id,options){
	options = options || {};
	
	ViewDocument.superclass.constructor.call(this,
		id,options);
	
	var self = this;	
	this.m_beforeOpen = function(contr,isInsert){
		var doc_id = 0;
		if (!isInsert){
			doc_id = self.getViewControl(self.getId()+"_id").getValue();
		}
		contr.run("before_open",{async:false,
			params:{"doc_id":doc_id
				}
			});
	}
	
	this.addDataControl(
		new EditNum(id+"_id",
		{"attrs":{"name":"id","value":"0"},
		"visible":false}),
		{"modelId":options.readModelId,
		"valueFieldId":"id",
		"keyFieldIds":null},
		{"valueFieldId":"id","keyFieldIds":null}
	);	
	this.addDataControl(
		new EditCheckBox(id+"_processed",
		{"attrs":{"name":"processed"},
		"visible":false}),
		{"modelId":options.readModelId,
		"valueFieldId":"processed",
		"keyFieldIds":null},
		{"valueFieldId":"processed","keyFieldIds":null}
	);	
	
	this.addDataControl(
		new EditNum(id+"_number",
		{"labelCaption":"Номер:","name":"number",
		"attrs":{"maxlength":5,"size":5,"disabled":"disabled"}
		}
		),
		{"modelId":options.readModelId,
		"valueFieldId":"number",
		"keyFieldIds":null},
		{"valueFieldId":null,"keyFieldIds":null}
	);
	
	this.addDataControl(
		new EditDateTime(id+"_date_time",
		{"labelCaption":"Дата:","name":"date_time",
		"attrs":{"required":"required"},
		"value":DateHandler.dateToStr(null,"dd/mm/y hh:mmin:ss")
		}
		),
		{"modelId":options.readModelId,
		"valueFieldId":"date_time_descr",
		"keyFieldIds":null},
		{"valueFieldId":"date_time","keyFieldIds":null}		
	);
	
}
extend(ViewDocument,ViewDialog);

ViewDocument.prototype.m_detailContainer;

ViewDocument.prototype.addDetailControl = function(detailControl){
	if (this.m_details==undefined){
		var detail_row = new ControlContainer(this.getId()+"_det_row","tr");
		var td = new ControlContainer(this.getId()+"_det_row_col","td",{"attrs":{"colspan":"2"}});
		detail_row.addElement(td);
		this.m_details = new ControlContainer(this.getId()+"_details","div",{"attrs":{"class":"tabber"}});
		/*
		this.m_detailFilter = new ListFilter();
		this.m_detailFilter.addFilter(this.getId()+"_detailFilter",
			{keyFieldIds:["doc_id"],valueFieldId:null,sign:"e"});
		*/
		td.addElement(this.m_details);
		this.addElement(detail_row);
	}
	//var grid = detailControl.getGridControl();
	//grid.setFilter(this.m_detailFilter);
	this.m_details.addElement(detailControl);
}
ViewDocument.prototype.getDetailControl = function(controlId){
	return this.m_details.getElementById(controlId);
}
/*
ViewDocument.prototype.toDOM = function(parent){
	ViewDocument.superclass.toDOM.call(this,parent);
	if (this.m_details){
		this.m_details.toDOM(parent);
	}
}
ViewDocument.prototype.removeDOM = function(){
	if (this.m_details){
		this.m_details.removeDOM();
	}
	ViewDocument.superclass.removeDOM.call(this);	
}
*/
ViewDocument.prototype.readData = function(async,isCopy){
	ViewDocument.superclass.readData.call(this,false,isCopy);
	/*
	if (this.m_detailFilter){		
		var node = this.getControl(this.getId()+"_id").control.m_node;
		this.m_detailFilter.setParamValue(this.getId()+"_detailFilter","key",
			node.getAttribute("old_id"));
	}
	*/
}
ViewDocument.prototype.onClickSave = function(){
	var cmd_insert = this.getIsNew();
	if (cmd_insert){
		//need return new serial id if any
		var contr = this.getWriteController();
		var meth_id = this.getWriteMethodId();
		var pm = contr.getPublicMethodById(meth_id);
		if (pm.paramExists(contr.PARAM_RET_ID)){
			pm.setParamValue(contr.PARAM_RET_ID,1);
		}
	}
	this.writeData(false);
	//this.readData(false);
	/*
	if (cmd_insert){
		this.m_bindings[this.m_idPrefix+"processed"].control.setChecked(true);
		if (this.m_details){
			for (var detail_id in this.m_details.m_elements){
				var grid = this.m_details.m_elements[detail_id].getGridControl();
				grid.onRefresh();
			}		
		}		
	}	
	*/
}
ViewDocument.prototype.getModified = function(){
	var modif = ViewDocument.superclass.getModified.call(this);
	if (!modif){
		//проверить табличные части
		modif = true;
	}
	return modif;
}
ViewDocument.prototype.setMethodParams = function(pm,checkRes){
	pm.setParamValue("processed","true");
	ViewDocument.superclass.setMethodParams.call(this,pm,checkRes);
	if (!checkRes.modif){
		//проверить табличные части
		checkRes.modif = true;
	}
}
