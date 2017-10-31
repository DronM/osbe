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
function ViewInlineGridEditConst(id,options){
	options.updateMethodId="set_value";
	ViewInlineGridEditConst.superclass.constructor.call(this,
		id,options);
	
	this.addDataControl(
		new EditString("ConstantList_Model_id",
		{"visible":false,
		"alwaysUpdate":true,
		"attrs":{"name":"id"}}
		),
		{"modelId":"ConstantList_Model",
		"valueFieldId":"id",
		"keyFieldIds":null},
		{"valueFieldId":"id","keyFieldIds":null}
	);		
		
	this.addDataControl(
		new EditString("ConstantList_Model_name",
		{"attrs":{"size":20,"disabled":"disabled","name":"name"}}
		),
		{"modelId":"ConstantList_Model",
		"valueFieldId":"name",
		"keyFieldIds":null},
		{"valueFieldId":"name","keyFieldIds":null}
	);
	this.addDataControl(
		new EditString("ConstantList_Model_descr",
		{"attrs":{"size":100,"disabled":"disabled","name":"descr"}}
		),
		{"modelId":"ConstantList_Model",
		"valueFieldId":"descr",
		"keyFieldIds":null},
		{"valueFieldId":"descr","keyFieldIds":null}
	);		
}
extend(ViewInlineGridEditConst,ViewInlineGridEdit);
/*
ViewInlineGridEditConst.prototype.writeData = function(){
	var contr = this.getWriteController();
	var meth_id = "set_value";
	var pm = contr.getPublicMethodById(meth_id);
	var ctrl,modif=false,id,val;
	for (var ctrl_id in this.m_bindings){
		ctrl = this.m_bindings[ctrl_id].control;
		if (ctrl.m_node.name && ctrl.m_node.name=="id"){
			id = ctrl.m_node.getAttribute("old_id");
		}
		else if (ctrl.m_node.name && ctrl.m_node.name=="val"){
			var key_field_ids = this.m_bindings[ctrl_id].writeBind.keyFieldIds;
			if (key_field_ids){
				val = ctrl.getFieldValue(key_field_ids[0]);
				modif = (val!=undefined);
			}
			else{
				val = ctrl.getValue();
				modif = (ctrl.m_node.getAttribute("old_val_descr")!=val);
			}
			if (modif){
				pm.setParamValue("val",val);
				pm.setParamValue("id",id);
			}
		}		
	}
	if (modif){
		//alert(contr.getQueryString(pm));
		contr.runPublicMethod(meth_id,{},false,
			this.onWriteOk,this,this.onError);		
	}
	else{	
		this.onWriteOk();
	}
}
*/