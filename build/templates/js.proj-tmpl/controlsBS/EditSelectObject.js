/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires controls/EditSelect.js
*/

/* constructor */
function EditSelectObject(id,options){
	options = options || {};
	options.noAutoRefresh=options.noAutoRefresh||false;
	EditSelectObject.superclass.constructor.call(
		this,id,options);
	if (options.controller){
		this.setController(options.controller);
	}
	
	this.m_keyFieldIds = options.keyFieldIds;
	
	if (options.methodId){
		this.setMethodId(options.methodId);
	}
	if (options.modelId){
		this.setModelId(options.modelId);
	}	
	if (options.lookupValueFieldId){
		this.m_lookupValueFieldId = options.lookupValueFieldId;
	}	
	if (options.lookupKeyFieldIds){
		this.m_lookupKeyFieldIds = options.lookupKeyFieldIds;
	}
	if (options.errorControl){
		this.m_errorControl	= options.m_errorControl;
	}
	if (options.refreshInterval){
		this.setRefreshInterval(options.refreshInterval);
	}
	if 	(options.methParams){
		this.m_methParams = options.methParams;
	}
	if (options.defaultId){
		this.m_defaultId = options.defaultId;
	}
	
	if (options.noAutoRefresh==undefined
	||(options.noAutoRefresh!=undefined&&options.noAutoRefresh==false)){
		this.onRefresh();
	}
	else{
		this.addElement(new EditSelectOption(this.getId()+"_enum_val_not_selected",
			{"optionId":"","optionDescr":this.NOT_SELECTED_DESCR,"optionSelected":true,
			"attrs":{"value":"undefined"}}));	
	}
}
extend(EditSelectObject,EditSelect);

EditSelectObject.prototype.NOT_SELECTED_DESCR = "<не выбран>";
EditSelectObject.prototype.INCORRECT_VAL_CLASS="incorrect_val";

/* private members */
EditSelectObject.prototype.m_modelId;
EditSelectObject.prototype.m_controller;
EditSelectObject.prototype.m_errorControl;

EditSelectObject.prototype.setModelId = function(modelId){
	this.m_modelId = modelId;
}
EditSelectObject.prototype.getModelId = function(){
	return this.m_modelId;
}
EditSelectObject.prototype.setMethodId = function(methodId){
	this.m_methodId = methodId;
}
EditSelectObject.prototype.getMethodId = function(){
	return this.m_methodId;
}

EditSelectObject.prototype.setController = function(controller){
	this.m_controller = controller;
}

EditSelectObject.prototype.toDOM = function(parent){
	EditSelectObject.superclass.toDOM.call(this,parent);
	//var id_val;
	//id_val = this.getValue();
	/*
	if (this.m_keyFieldIds && this.m_keyFieldIds.length){
		id_val = DOMHandler.getAttr(this.m_node,"fkey_"+this.m_keyFieldIds[0]);
	}
	*/
	if (!this.m_oldSelectedValue&&this.m_defaultId){
		this.setByFieldId(this.m_defaultId);
	}
	else if (this.m_oldSelectedValue){
		this.setByFieldId(this.m_oldSelectedValue);
	}	
}

EditSelectObject.prototype.onRefresh = function(){
	var self = this;
	this.m_wasEnabled=this.getEnabled();
	this.setEnabled(false);
	this.m_controller.run(this.getMethodId(),{
		func:function(resp){
			self.onGetData(resp);
		},
		async:false,
		params:this.m_methParams,
		errControl:this.m_errorControl
	});
}

EditSelectObject.prototype.onGetData = function(resp){		
	if (this.m_wasEnabled){
		this.setEnabled(true);
	}
	this.m_oldSelectedValue = this.getValue();
	/*на случай если это поле зависит от
	другого и читает новые данные*/
	var cur_val = this.getAttr("fkey_"+this.getFieldId());

	this.clear();
	this.addElement(new EditSelectOption(this.getId()+"_enum_val_not_selected",
		{"optionId":"",
		"optionDescr":this.NOT_SELECTED_DESCR,
		//"optionSelected":(sel_id==undefined&&(this.m_defaultId==undefined||this.m_defaultId=="undefined")),
		"attrs":{"value":"undefined"}}));
	
	var listModel = resp.getModelById(this.getModelId());
	listModel.setActive(true);
	var key_field_val,descr_field_val;
	var ind = 0;
	var other_fields={};
	while (listModel.getNextRow()){
		key_field_val = listModel.getFieldById(this.m_lookupKeyFieldIds[0]).getValue();
		descr_field_val = listModel.getFieldById(this.m_lookupValueFieldId).getValue();
		for (var field_id in listModel.m_fields){
			if (field_id!=this.m_lookupKeyFieldIds[0]
			&&field_id!=this.m_lookupValueFieldId){
				other_fields[field_id]=listModel.getFieldValue(field_id);
			}
		}
		delete other_fields.selected;
		/*
		var opt_selected = (
			(sel_id!=undefined&&key_field_val==sel_id)
			||(sel_id==undefined&&this.m_defaultId&&key_field_val==this.m_defaultId)
		);
		*/
		this.addElement(new EditSelectOption(this.getId()+"_"+key_field_val,
		{
			"optionId":key_field_val,
			"optionDescr":descr_field_val,
			"attrs":other_fields,
			"optionSelected":
			(
			(this.m_oldSelectedValue&&this.m_oldSelectedValue==key_field_val)
			||
			(!this.m_oldSelectedValue&&cur_val==key_field_val)
			)
		}));
		ind++;
	}
	for (var elem_id in this.m_elements){
		this.m_elements[elem_id].toDOM(this.m_node);
	}
}

EditSelectObject.prototype.setValue = function(value){
	/*
	var i=0;
	for (var elem_id in this.m_elements){
		if (this.m_elements[elem_id].getOptionDescr()==value){
			this.m_node.selected="selected";
			this.m_node.selectedIndex = i;
			break;
		}
		i++;
	}				
	*/
}
EditSelectObject.prototype.setRefreshInterval = function(refreshInterval){
	this.m_interval = refreshInterval;
	if (refreshInterval==0 && this.m_intervalObj!=undefined){		
		window.clearInterval(this.m_intervalObj);
	}
	else if (refreshInterval>0){
		var self = this;
		this.m_intervalObj = setInterval(function(){
			self.onRefresh();
		},refreshInterval);
	}
}
EditSelectObject.prototype.getRefreshInterval = function(){
	return this.m_interval;
}
EditSelectObject.prototype.removeDOM = function(){
	this.setRefreshInterval(0);
	EditSelectObject.superclass.removeDOM.call(this);
}
EditSelectObject.prototype.setDefaultId = function(){
	this.m_oldSelectedValue=undefined;
	this.setByFieldId(this.m_defaultId);
	/*
	if (this.m_keyFieldIds){
		for (var i=0;i<this.m_keyFieldIds.length;i++){
			this.m_node.setAttribute("fkey_"+this.m_keyFieldIds[i],this.m_defaultId);
			this.m_node.setAttribute("old_"+this.m_keyFieldIds[i],"0");
		}
	}
	*/
}
EditSelectObject.prototype.getFieldId = function(){
	if (this.m_node.selectedIndex>0){
		return this.m_node.options[this.m_node.selectedIndex].value;
	}
}
EditSelectObject.prototype.setFieldId = function(id,value){	
	this.m_oldSelectedValue = value;
	this.m_node.setAttribute("fkey_"+id,value);
	this.setByFieldId(value);
}
EditSelectObject.prototype.setFormerFieldId = function(id,value){
	DOMHandler.setAttr(this.m_node,"old_"+id,value);
}
EditSelectObject.prototype.getFieldId = function(){
	if (!this.m_keyFieldIds || this.m_keyFieldIds.length==0){
		throw new Error("Ключевые поля не определены!");
	}
	else if (this.m_keyFieldIds.length==1){
		for (var id in this.m_keyFieldIds){
			return this.m_keyFieldIds[id];
			break;
		}
	}
	else{
		throw new Error("Объект имеет несколько ключевых полей!");
	}
}
EditSelectObject.prototype.setFieldValue = function(id,value){
	if (id==undefined){
		id = this.getFieldId();
	}
	this.setFieldId(id,value);
}
EditSelectObject.prototype.setFormerFieldValue = function(id,value){
	if (id==undefined){
		id = this.getFieldId();
	}
	DOMHandler.setAttr(this.m_node,"old_"+id,value);
}
EditSelectObject.prototype.getFieldValue = function(id){
	if (this.m_node.selectedIndex>=1){
		return this.m_node.options[this.m_node.selectedIndex].value;
	}
	//else{
		//return "undefined";
	//}
}
EditSelectObject.prototype.getFieldAttr = function(attr){
	if (this.m_node.selectedIndex>=1){
		return this.m_node.options[this.m_node.selectedIndex].getAttribute(attr);
	}
	/*
	else{
		return "undefined";
	}
	*/
}
EditSelectObject.prototype.getFormerFieldValue = function(id){
	if (id==undefined){
		id = this.getFieldId();
	}
	return DOMHandler.getAttr(this.m_node,"old_"+id);
}
EditSelectObject.prototype.isEmpty = function(val){	
	return (this.m_node.options[this.m_node.selectedIndex].id==
	this.getId()+"_enum_val_not_selected");
}
EditSelectObject.prototype.setNotValid = function(erStr){
	DOMHandler.addClass(this.m_node,this.INCORRECT_VAL_CLASS);
	throw new Error(erStr);
}
EditSelectObject.prototype.setValid = function(){
	DOMHandler.removeClass(this.m_node,this.INCORRECT_VAL_CLASS);
}

EditSelectObject.prototype.validate = function(val){
	this.setValid();
	if (this.m_node.getAttribute("required")=="required"
	&&this.isEmpty(val)){
		this.setNotValid("Не выбрано значение");
	}
	return val;
}
EditSelectObject.prototype.resetValue = function(){
	this.setDefaultId();
}
EditSelectObject.prototype.setByIndex = function(ind){
	EditSelectObject.superclass.setByIndex.call(this,ind);
}