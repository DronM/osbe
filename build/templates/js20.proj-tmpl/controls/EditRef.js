/* Copyright (c) 2016
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/

/** Requirements
  * @requires controls/Control.js
  * @requires controls/ControlContainer.js
  * @requires controls/ButtonOpen.js  
  * @requires controls/ButtonSelect.js    
  * @requires controls/ButtonClear.js  
  * @requires controls/Label.js    
*/

/* constructor
@param string id 
@param object options {
	@param bool acMinLengthForQuery
	@param bool acIc
	@param bool acMid
	@param Model acModel
	@param PublicMethod acPublicMethod
}
*/
function EditRef(id,options){
	options = options || {};

	if(options.keys){
		this.setKeys(options.keys);
	}
	
	if(options.keyIds){
		this.setKeyIds(options.keyIds);
	}
	
	options.cmdInsert = (options.cmdInsert!=undefined)? options.cmdInsert:true;
	options.cmdSelect = (options.cmdSelect!=undefined)? options.cmdSelect:true;
	options.cmdOpen = (options.cmdOpen!=undefined)? options.cmdOpen:true;
	options.cmdClear = (options.cmdClear!=undefined)? options.cmdClear:true;
	options.cmdAutoComplete = (options.cmdAutoComplete!=undefined)? options.cmdAutoComplete:true;

	if (options.cmdInsert){
		options.buttonInsert = options.buttonInsert ||
			new ButtonInsert(id+":btn_insert",{
				"editControl":this,
				"app":options.app
			});
	}

	
	if (options.cmdSelect && !options.buttonSelect && options.selectWinClass){
		options.buttonSelect = new ButtonSelectRef(id+':btn_select',
			{"winClass":options.selectWinClass,
			"winParams":options.selectWinParams,
			"descrIds":options.selectDescrIds,
			//"descrFunction":options.selectDescrFunction,
			"keyIds":options.selectKeyIds,
			"control":this,
			"onSelect":options.onSelect,
			"formatFunction":options.selectFormatFunction,
			"multySelect":options.selectMultySelect,
			"app":options.app
			});
	}
	
	if (options.cmdOpen && !options.buttonOpen && options.editWinClass){
		options.buttonOpen = new ButtonOpen(id+':btn_open',
			{"winClass":options.editWinClass,
			"winParams":options.editWinParams,
			"keyIds":options.openKeyIds,
			"control":this,
			"app":options.app
			});			
	}
	
	if (options.cmdClear){
		options.buttonClear = options.buttonClear || new ButtonClear(id+":btn_clear",{
				"editControl":this,
				"app":options.app
			});
	}
	
	if (!options.cmdAutoComplete){
		options.inputEnabled = false;
	}
	
	this.setOnSelect(options.onSelect);
	
	EditRef.superclass.constructor.call(this, id, options);
	
	if (!this.getKeyIds().length){
		throw Error(CommonHelper.format(this.ER_NO_KEY,Array[this.getName()]));
	}
	
	if (options.cmdAutoComplete || options.autoComplete){
		if (!options.acPublicMethod && options.acController){
			options.acPublicMethod = options.acController.getPublicMethod("complete");
		}
		options.autoComplete = options.autoComplete || new actbAJX(
			{"minLengthForQuery":options.acMinLengthForQuery,
			"onSelect":options.onSelect,
			"model":options.acModel,
			"publicMethod":options.acPublicMethod,
			"patternFieldId":options.acPatternFieldId,
			"control":this,
			"keyFields":options.acKeyFields,
			"descrFields":options.acDescrFields,
			"icase":options.acICase,
			"mid":options.acMid  
			}
		);
		actb(this.m_node,options.winObj,options.autoComplete);
	}
	
	this.setAutoComplete(options.autoComplete);
	this.setButtonInsert(options.buttonInsert);	
		
}
extend(EditRef,Edit);

/* constants */
EditRef.prototype.KEY_ATTR = "keys";
EditRef.prototype.KEY_INIT_ATTR = "initKeys";

/* private members */
EditRef.prototype.m_buttonInsert;
EditRef.prototype.m_autoComplete;
EditRef.prototype.m_keyIds;//array of key identifiers


EditRef.prototype.addButtonControls = function(){
	if (this.m_buttonInsert) this.m_buttons.addElement(this.m_buttonInsert);
	if (this.m_buttonOpen) this.m_buttons.addElement(this.m_buttonOpen);
	if (this.m_buttonSelect) this.m_buttons.addElement(this.m_buttonSelect);
	if (this.m_buttonClear) this.m_buttons.addElement(this.m_buttonClear);
}

EditRef.prototype.keys2Str = function(keys){
	return CommonHelper.array2json(keys);
}

EditRef.prototype.str2Keys = function(str){
	return CommonHelper.json2obj(str);
}


/* public methods */
EditRef.prototype.setButtonInsert = function(v){
	this.m_buttonInsert = v;
}
EditRef.prototype.getButtonInsert = function(){
	return this.m_buttonInsert;
}

EditRef.prototype.setAutoComplete = function(v){
	this.m_autoComplete = v;
}
EditRef.prototype.getAutoComplete = function(){
	return this.m_autoComplete;
}


EditRef.prototype.setKeys = function(keys){
	if (!CommonHelper.isEmpty(keys)){
		this.m_keyIds = [];
		for (var keyid in keys){
			this.m_keyIds.push(keyid);
		}
	}
	else if (!this.m_keyIds){
		this.m_keyIds = [];
	}
	this.setAttr(this.KEY_ATTR,this.keys2Str(keys));
	
	if (this.m_onValueChange){
		this.m_onValueChange.call(this);
	}	
}

EditRef.prototype.setKeyIds = function(v){	
	this.m_keyIds = v;
}

EditRef.prototype.getKeyIds = function(){	
	return this.m_keyIds;
}


EditRef.prototype.getKeys = function(){
	return this.str2Keys( this.getAttr(this.KEY_ATTR) );
}

EditRef.prototype.setInitKeys = function(keys){
	this.setAttr(this.KEY_INIT_ATTR,this.keys2Str(keys));
}

EditRef.prototype.getInitKeys = function(){
	return this.str2Keys( this.getAttr(this.KEY_INIT_ATTR) );
}

EditRef.prototype.getIsRef = function(){
	return true;
}

EditRef.prototype.getModified = function(){
	return (this.getAttr(this.KEY_ATTR) != this.getAttr(this.KEY_INIT_ATTR));
}

EditRef.prototype.isNull = function(){
	return CommonHelper.isEmpty(this.getKeys());
}

EditRef.prototype.resetKeys = function(){
	this.setKeys({});
}

EditRef.prototype.reset = function(){	
	EditRef.superclass.reset.call(this);
	this.resetKeys();
}

EditRef.prototype.setValue = function(val){
	var descr;	
	if (typeof val == "object" && val.getKeys && val.getDescr){
		this.setKeys(val.getKeys());
		descr = val.getDescr(); 
	}
	else if (typeof val == "object" && val.keys && val.descr){
		this.setKeys(val.keys);
		descr = val.descr; 
	}
	else if (typeof val == "object" && val.m_keys && val.m_descr){
		this.setKeys(val.m_keys);
		descr = val.m_descr; 
	}			
	else if (typeof val != "object"){
		descr = val;
	}
	else{
		descr = "";
	}
	EditRef.superclass.setValue.call(this,descr);
}

EditRef.prototype.getValue = function(){
	var descr = EditRef.superclass.getValue.call(this);

	//@ToDo null value if no keys
	return new RefType(
		{"keys":this.getKeys(),
		"descr":descr
		}
	);
}

EditRef.prototype.getKeyValue = function(key){
	return this.getValue().getKey(key);
}

EditRef.prototype.setInitValue = function(val){
	this.setValue(val);
	if (typeof val == "object"){
		this.setInitKeys(val.getKeys());
	}	
	
	//EditRef.superclass.setInitValue.call(this,this.getValue().descr);
}

EditRef.prototype.setOnSelect = function(v){
	this.m_onSelect = v;
}
EditRef.prototype.getOnSelect = function(v){
	return this.m_onSelect;
}
