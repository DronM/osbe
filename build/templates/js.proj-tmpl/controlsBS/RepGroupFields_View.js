/* Copyright (c) 2015 
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
function RepGroupFields_View(id,options){
	options.className = options.className||"form-group";
	
	RepGroupFields_View.superclass.constructor.call(this,
		id,options);
			
	options.initVals=options.initVals||{};
	
	//Наименование
	this.addControl(new EditString(id+"_name",{
		"labelCaption":"Наименование:",
		"value":options.initVals.name
	}));
	
	this.addControl(new ButtonCmd(id+"_select",{
		"caption":"Выбрать",
		"onClick":function(){
			options.onClose(true);
		}
	}));
	this.addControl(new ButtonCmd(id+"_close",{
		"caption":"Отмена",
		"onClick":function(){
			options.onClose(false);
		}
	}));
	
	var head = new GridHead();
	var row = new GridRow(id+"_head_row");	
	row.addElement(new GridDbHeadCell(id+"_col_fields",{"value":"Колонки"}));	
	row.addElement(new GridDbHeadCell(id+"_col_field_includes"));
	head.addElement(row);
	
	//body
	var body = new GridBody();
	if (options.initVals.fields){
		for (var i=0;i<options.initVals.fields.length;i++){
			var fieldStruc = options.initVals.fields[i];
			
			if (fieldStruc.agg)continue;
			
			var row = new GridRow(this.getId()+"_row_"+fieldStruc.id,{
				"attrs":{"fieldId":fieldStruc.id}});
			
			//наименование
			row.addElement(new GridCell(this.getId()+"_"+fieldStruc.id+"_name",
				{"value":fieldStruc.name}
			));
			
			//отображать
			row.addElement(new GridCell(this.getId()+"_"+fieldStruc.id+"_field_include",
				{"controlContainer":new EditCheckBox(this.getId()+"_fld_"+fieldStruc.id,{			
					"className":"field_toggle",
					"checked":fieldStruc.checked,
					"attrs":{"align":"center",
							"field_data":array2json({
								"id":fieldStruc.id,
								"name":fieldStruc.name
								})
							}})		
				}
			));
			
			body.addElement(row);
		}
	}
	
	this.addControl(new RepBaseFields(id+"_field_grid",{
		"head":head,
		"body":body		
		/*
		,"commandPanel":new RepFieldsCommands(id+"_field_grid_cmd",{
			"noInsert":true,
			"noEdit":true,
			"noDelete":true
		})
		*/
	}));		
}
extend(RepGroupFields_View,View);

RepGroupFields_View.prototype.getSelectedFields = function(){
	var fields = {};
	var gr = this.getControl(this.getId()+"_field_grid");
	var list = DOMHandler.getElementsByAttr("field_toggle",gr.getNode(),"class");
	for (var i=0;i<list.length;i++){
		if (list[i].checked){
			var o = json2obj(DOMHandler.getAttr(list[i],"field_data"));
			fields[o.id] = o;
		}
	}
	return fields;
}
