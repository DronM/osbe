/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @requires core/extend.js  

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {namespace} options
 * @param {bool} [options.cashable=true]
 * @param {Model} options.model
 * @param {PublicMethod} options.readPublicMethod
 * @param {Array} options.modelKeyFields
 * @param {Array} options.modelKeyIds
 * @param {Array} options.modelDescrFields
 * @param {Array} options.modelDescrFields
 * @param {Array} options.modelDescrIds
 * @param {function} options.modelDescrFormatFunction
 * @param {bool} [options.autoRefresh=true] Refreshing is called automaticaly after toDOM
 * @param {string} options.modelDataStr
 
 * @param {Control} options.dependBaseControl
 * @param {Array} options.dependBaseFieldIds
 * @param {Array} options.dependFieldIds       
 */

function EditSelectRef(id,options){
	options = options || {};
	
	options.optionClass = options.optionClass || EditSelectOptionRef;
	
	this.setCashable((options.cashable!=undefined)? options.cashable:true);
	this.setModel(options.model);
	this.setReadPublicMethod(options.readPublicMethod);

	this.setKeyIds(options.keyIds);
	
	this.setModelKeyFields(options.modelKeyFields);
	this.setModelKeyIds(options.modelKeyIds);	
	
	this.setModelDescrFields(options.modelDescrFields);
	this.setModelDescrIds(options.modelDescrIds);
	this.setModelDescrFormatFunction(options.modelDescrFormatFunction);
	
	//dependancy
	this.setDependBaseControl(options.dependBaseControl);
	this.setDependBaseFieldIds(options.dependBaseFieldIds);
	this.setDependFieldIds(options.dependFieldIds);
	
	this.setAutoRefresh((options.autoRefresh!=undefined)? options.autoRefresh:true);
	
	var self = this;
	
	options.events = options.events || {};
	if (!options.events.change){
		options.events.change = function(){
			self.callOnSelect();
		}
	}
	else{
		this.m_origOnChange = options.events.change;
		options.events.change = function(){
			self.callOnSelect();
			self.m_origOnChange();
		}			
	}

	EditSelectRef.superclass.constructor.call(this, id, options);
	
	if (options.modelDataStr && this.m_model){		
		if (this.getCashable()){
			window.getApp().setCashData(this.m_model.getId(),options.modelDataStr);
		}
		this.m_model.setDate(options.modelDataStr);
	}
	
	if (!this.m_autoRefresh)this.onRefresh();
	
}
extend(EditSelectRef,EditSelect);

/* private members */
EditSelectRef.prototype.m_oldEnabled;
EditSelectRef.prototype.m_cashable;
EditSelectRef.prototype.m_readPublicMethod;
EditSelectRef.prototype.m_model;

EditSelectRef.prototype.m_keyIds;
EditSelectRef.prototype.m_modelKeyFields;
EditSelectRef.prototype.m_modelKeyIds;
EditSelectRef.prototype.m_modelDescrFields;
EditSelectRef.prototype.m_modelDescrIds;
EditSelectRef.prototype.m_modelDescrFormatFunction;

EditSelectRef.prototype.m_dependBaseControl;
EditSelectRef.prototype.m_dependBaseFieldIds;
EditSelectRef.prototype.m_dependFieldIds;
EditSelectRef.prototype.m_dependControl;

EditSelectRef.prototype.m_autoRefresh;

//EditSelectRef.prototype.NOT_SELECTED_VAL = "null";//????should be null
EditSelectRef.prototype.KEY_ATTR = "keys";
EditSelectRef.prototype.KEY_INIT_ATTR = "initKeys";


EditSelectRef.prototype.keys2Str = function(keys){
	return CommonHelper.array2json(keys);
}

EditSelectRef.prototype.str2Keys = function(str){
	return CommonHelper.json2obj(str);
}


/* Public */
EditSelectRef.prototype.setKeys = function(keys){
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
	
	if (this.getDependControl()){
		this.getDependControl().dependOnSelectBase(this.getModelRow());
	}
	
	if (this.m_onValueChange){
		this.m_onValueChange.call(this);
	}
}

EditSelectRef.prototype.getKeyIds = function(){
	return this.m_keyIds;
}
EditSelectRef.prototype.setKeyIds = function(v){
	this.m_keyIds = v;
}

EditSelectRef.prototype.getKeys = function(){
	return this.str2Keys( this.getAttr(this.KEY_ATTR) );
}

EditSelectRef.prototype.setInitKeys = function(keys){
	this.setAttr(this.KEY_INIT_ATTR,this.keys2Str(keys));
}

EditSelectRef.prototype.getInitKeys = function(){
	return this.str2Keys( this.getAttr(this.KEY_INIT_ATTR) );
}

EditSelectRef.prototype.getModified = function(){
	return (this.getAttr(this.KEY_ATTR) != this.getAttr(this.KEY_INIT_ATTR));
}

EditSelectRef.prototype.getIsRef = function(){
	return true;
}

EditSelectRef.prototype.resetKeys = function(){
	this.setKeys({});
}

EditSelectRef.prototype.reset = function(){	
	EditSelectRef.superclass.reset.call(this);
	this.resetKeys();
}

/**
  * @param {Object|RefType} val
  */
EditSelectRef.prototype.setValue = function(val){
//console.log("EditSelectRef.prototype.setValue")
//console.dir(val)

	if (val!=null && typeof val == "object" && ( (val.getKeys && val.getDescr) || (val.keys && val.descr) ) ){
		//RefType || RefType old style unserealized
		var val = val.getKeys? val.getKeys():val.keys;
		if (!this.m_keyIds){
			this.m_keyIds = [];
			for (var keyid in val){
				this.m_keyIds.push(keyid);
			}
		}
	}
	else{
		if (!this.getModelKeyFields()){
			this.defineModelKeyFieds();
		}	
		val_str = (val!=null)? val.toString():null;
		val = {};
		//First key???
		val[this.getModelKeyFields()[0].getId()] = val_str;
	}	
/*
	var model_keys = {};
	var ind = 0;
	for (var i=0;i<this.m_modelKeyFields.length;i++){
		var key_id = this.m_modelKeyFields[i].getId();
		model_keys[key_id] = val[key_id];		
		ind++;
	}
*/
	var rec_found;
	for(var id in this.m_elements){
		var v = this.m_elements[id].getValue();
		rec_found = false;
		for (var vk in v){
			rec_found = (v[vk]==val[vk]);
			if (!rec_found){
				break;			
			}
		}
		if (rec_found){
			this.selectOptionById(id);
			break;
		}
	}		

	this.setKeys(val);
	
	//EditSelectRef.superclass.setValue.call(this,val);
}

EditSelectRef.prototype.getValue = function(){
	var ind = this.getIndex();
	if (ind){
		var elem = this.getElement(ind);		
		return new RefType(
			{"keys":this.getKeys(),
			"descr":elem.getDescr()
			}
		);
	}	
	/*
	var v = EditSelectRef.superclass.getValue.call(this);
	if (v){
		var keys = {};
		keys[this.getKeyIds()[0]] = v;
		return new RefType(
			{"keys":keys,
			"descr":this.getNode().options[this.m_node.selectedIndex].innerHTML
			}
		);
	}
	*/
}

EditSelectRef.prototype.setInitValue = function(val){
//console.log("EditSelectRef.prototype.setInitValue")
//console.dir(val)
	//@ToDo get rid of this!!!
	/*
	if (isNaN(val) || val=="NaN"){
		val = this.NOT_SELECTED_VAL;
	}
	EditSelectRef.superclass.setInitValue.call(this,val);
	*/	
	this.setValue(val);	
	if (typeof val == "object"){
		this.m_initValue = val;
		this.setInitKeys(val.getKeys());
	}	
}

EditSelectRef.prototype.getInitValue = function(){
	return this.getInitKeys();
}

EditSelectRef.prototype.setCashable = function(v){
	this.m_cashable = v;
}
EditSelectRef.prototype.getCashable = function(){
	return this.m_cashable;
}

EditSelectRef.prototype.setReadPublicMethod = function(v){
	this.m_readPublicMethod = v;
}
EditSelectRef.prototype.getReadPublicMethod = function(){
	return this.m_readPublicMethod;
}

EditSelectRef.prototype.defineModelKeyFieds = function(){
	//key fields
	if (this.getModelKeyIds()){
		var key_fields = [];
		var ids = this.getModelKeyIds();
		for (var i=0;i<ids.length;i++){
			if (this.m_model.fieldExists(ids[i])){
				key_fields.push(this.m_model.getField(ids[i]));
			}
		}
		this.setModelKeyFields(key_fields);
	}
	else{
		var key_fields = [];
		var fields = this.m_model.getFields();
		for (var id in fields){
			if (fields[id].getPrimaryKey()){
				key_fields.push(fields[id]);
			}
		}
		this.setModelKeyFields(key_fields);
	}
}

EditSelectRef.prototype.defineModelDescrFieds = function(){
	//descr fields
	if (this.getModelDescrIds()){
		var key_fields = [];
		var ids = this.getModelDescrIds();
		for (var i=0;i<ids.length;i++){
			if (this.m_model.fieldExists(ids[i])){
				key_fields.push(this.m_model.getField(ids[i]));
			}
		}
		this.setModelDescrFields(key_fields);
	}
}

EditSelectRef.prototype.setModel = function(v){
	this.m_model = v;
	this.setModelKeyFields(undefined);
	this.setModelDescrFields(undefined);
	
	this.defineModelKeyFieds();
	this.defineModelDescrFieds();
		
}
EditSelectRef.prototype.getModel = function(){
	return this.m_model;
}

EditSelectRef.prototype.getModelKeyIds = function(){
	return this.m_modelKeyIds;
}
EditSelectRef.prototype.setModelKeyIds = function(v){
	this.m_modelKeyIds = v;
}

EditSelectRef.prototype.getModelKeyFields = function(){
	return this.m_modelKeyFields;
}
EditSelectRef.prototype.setModelKeyFields = function(v){
	this.m_modelKeyFields = v;
}

EditSelectRef.prototype.getModelDescrIds = function(){
	return this.m_modelDescrIds;
}
EditSelectRef.prototype.setModelDescrIds = function(v){
	this.m_modelDescrIds = v;
}

EditSelectRef.prototype.getModelDescrFields = function(){
	return this.m_modelDescrFields;
}
EditSelectRef.prototype.setModelDescrFields = function(v){
	this.m_modelDescrFields = v;
}

EditSelectRef.prototype.getModelDescrFormatFunction = function(){
	return this.m_modelDescrFormatFunction;
}
EditSelectRef.prototype.setModelDescrFormatFunction = function(v){
	this.m_modelDescrFormatFunction = v;
}


EditSelectRef.prototype.toDOM = function(parent){
	EditSelectRef.superclass.toDOM.call(this,parent);
	
	if (this.getAutoRefresh()){
		this.onRefresh();
	}
}

EditSelectRef.prototype.onGetData = function(resp){
//console.log("EditSelectRef.prototype.onGetData resp=")
//console.dir(resp)

	if (!this.m_model) return;
	
	if (resp && this.m_model){
		this.m_model.setData(resp.getModelData(this.m_model.getId()));
		
		if (this.getCashable()){
			window.getApp().setCashData(this.m_model.getId(),resp.getModelData(this.m_model.getId()));
		}
	}
	
	var old_key_val;
	if (this.m_initValue){
		old_key_val = this.m_initValue;
		this.m_initValue = undefined;
	}
	else{
		old_key_val = this.getValue();
		if (old_key_val){
			old_key_val = old_key_val.getKeys();
		}		
	}
	
	//lookup field
	if (!this.getModelKeyFields()){
		this.defineModelKeyFieds();
		/*
		if (!this.getModelKeyFields()){
			//first key field
			this.m_modelKeyFields = [];
			
			var fields = this.m_model.getFields();
			for (var id in fields){
				if (fields[id].getPrimaryKey()){
					this.m_modelKeyFields.push(fields[id]);
				}
			}		
		}
		*/
		if (!this.getModelKeyFields()){
			throw Error(CommonHelper.format(this.ER_NO_LOOKUP,Array(this.getName())));
		}		
	}
	//****************

	//descr field
	if (!this.getModelDescrFormatFunction() && !this.getModelDescrFields()){
		this.defineModelDescrFieds();
		
		if (!this.getModelDescrFields()){
			//first key field
			this.m_modelDescrFields = [];
			var fields = this.m_model.getFields();
			var fields = this.m_model.getFields();
			for (var id in fields){
				if (!fields[id].getPrimaryKey()){
					this.m_modelDescrFields.push(fields[id]);
				}
			}
		}
		if (!this.getModelKeyFields()){
			//descr = key
			this.setModelDescrFields(this.getModelKeyFields());
		}		
	}
	
	//****************
		
	this.clear();
	var opt_class = this.getOptionClass();
	
	if (this.getAddNotSelected()){
		var val = {};
		for (var i=0;i<this.m_modelKeyFields.length;i++){
			val[this.m_modelKeyFields[i].getId()] = this.NOT_SELECTED_VAL;
		}
		var def_opt_opts = {"value":val,"descr":this.NOT_SELECTED_DESCR};//"NaN"
	}
	
	var opt_ind = 0;
	
	if (this.getAddNotSelected() && !this.getNotSelectedLast()){
		this.addElement(new opt_class(this.getId()+":"+opt_ind,def_opt_opts));	
		
		opt_ind++;
	}
	
	var opt_checked = false;
	var old_keys;
	
	if (old_key_val && typeof(old_key_val) == "object" && old_key_val.getKeys){
		old_keys = old_key_val.getKeys();
	}
//console.log("EditSelectRef.prototype.onGetData OLdKeys=")
//console.dir(old_keys)				
	
	var ind = 0;
	while (this.m_model.getNextRow()){
		var opt_key_val = {};
		var keys = {};
		for (var i=0;i<this.m_modelKeyFields.length;i++){
			var key_v = this.m_modelKeyFields[i].getValue();
			opt_key_val[this.m_modelKeyFields[i].getId()] = key_v;
			keys[this.m_keyIds[i]] = key_v; 
		}
//console.dir(keys)		
		var cur_opt_checked = false;
		if (!opt_checked){
			if (old_keys){
				//ref object passed as init key						
				for (var key_id in keys){
					opt_checked = (old_keys[key_id] && keys[key_id] == old_keys[key_id]);
					if (!opt_checked){
						break;
					}
				}
				cur_opt_checked = opt_checked;
			}
			else if (old_key_val){
				//simple value - string/number, check first key
				for (var key_id in keys){
					opt_checked = (keys[key_id] == old_key_val);
					break;
				}			
				cur_opt_checked = opt_checked;
			}			
		}
				
		var descr_val = "";
		if (this.getModelDescrFormatFunction()){
			descr_val = this.getModelDescrFormatFunction().call(this,this.m_model.getFields());
		}
		else{
			for (var i=0;i<this.m_modelDescrFields.length;i++){
				descr_val+= (descr_val=="")? "":" ";
				descr_val+= this.m_modelDescrFields[i].getValue();
			}		
		}
		
		this.addElement(new opt_class(this.getId()+":"+opt_ind,{
			"checked":cur_opt_checked,
			"value":opt_key_val,
			"descr":descr_val,
			"attrs":{
				"modelIndex":ind
			}
		}));	
		ind++;
		opt_ind++;
		
	}
	
	if (this.getAddNotSelected() && this.getNotSelectedLast()){
		if (!opt_checked){
			def_opt_opts.checked = true;
			opt_checked = true;
		}
		this.addElement(new opt_class(this.getId()+":"+opt_ind,def_opt_opts));	
	}
	
	if (!opt_checked && this.getCount()){
		this.setIndex(0);
	}
	
	for (var elem_id in this.m_elements){
		this.m_elements[elem_id].toDOM(this.m_node);
	}
	
	this.setEnabled(this.m_oldEnabled);
}

EditSelectRef.prototype.onRefresh = function(){	
//console.log("EditSelectRef.prototype.onRefresh")
	if (this.getCashable() && this.m_model){
		var cash = window.getApp().getCashData(this.m_model.getId());
		if (cash){
			this.m_oldEnabled = this.getEnabled();	
			this.setEnabled(false);
		
			this.m_model.setData(cash);
			this.onGetData();
			return;		
		}
	}

	this.m_oldEnabled = this.getEnabled();	
	this.setEnabled(false);
	var self = this;
	this.getReadPublicMethod().run({
		"async":false,
		"ok":function(resp){			
			self.onGetData(resp);
		},
		"fail":function(resp,erCode,erStr){
			self.setEnabled(self.m_oldEnabled);
			self.getErrorControl().setValue(window.getApp().formatError(erCode,erStr));
		}
	});
}


EditSelectRef.prototype.callOnSelect = function(){
	var i = this.getIndex();
	var model_keys = this.getElement(i).getValue();
	
	var key_ids = this.getKeyIds();
	var keys = {};
	var i = 0;
	for (id in model_keys){
		keys[key_ids[i]] = model_keys[id];
		i++;
	}
	
	this.setKeys(keys);

	/*
	if (this.getDependControl()){
		this.getDependControl().dependOnSelectBase(this.getModelRow());
	}
	*/
	//EditSelectRef.superclass.callOnSelect.call(this);
	if (this.getOnSelect()){
		this.m_onSelect.call(this,this.getModelRow());
	}
	
}

EditSelectRef.prototype.getModelRow = function(){
	var ind;
	
	if (this.getIndex()>=0){
		ind = this.getNode().options[this.m_node.selectedIndex].getAttribute("modelIndex");					
	}
	
	if (ind!=undefined && ind>=0){
		this.m_model.getRow(ind);
	}
	else{
		this.m_model.reset();
	}
	
	return this.m_model.getFields();
}
EditSelectRef.prototype.setAutoRefresh = function(autoRefresh){
	this.m_autoRefresh = autoRefresh;
}
EditSelectRef.prototype.getAutoRefresh = function(){
	return this.m_autoRefresh;
}

EditSelectRef.prototype.setDependBaseControl = function(v){
	this.m_dependBaseControl = v;
	
	if (this.m_dependBaseControl && this.m_dependBaseControl.setDependentControl){
		this.setDependentControl(this);
	}
}

EditSelectRef.prototype.getDependBaseControl = function(){
	return this.m_dependBaseControl;
}

EditSelectRef.prototype.setDependBaseFieldIds = function(v){
	this.m_dependBaseFieldIds = v;
}
EditSelectRef.prototype.getDependBaseFieldIds = function(){
	return this.m_dependBaseFieldIds;
}

EditSelectRef.prototype.setDependFieldIds = function(v){
	this.m_dependFieldIds = v;
}
EditSelectRef.prototype.getDependFieldIds = function(){
	return this.m_dependFieldIds;
}
EditSelectRef.prototype.setDependControl = function(v){
	this.m_dependControl = v;
}
EditSelectRef.prototype.getDependControl = function(){
	return this.m_dependControl;
}
EditSelectRef.prototype.dependOnSelectBase = function(baseModelRow){
	
	var pm = this.getReadPublicMethod();
	if (!pm)return;
	var contr = pm.getController();
	
	var cond_fields,cond_sgns,cond_vals;

	var cond_keys = this.getDependFieldIds();
	var base_keys = this.getDependBaseFieldIds();
	var ind = -1;
	for (var fid in baseModelRow){
	
		var cond_key = undefined;
		
		if (!base_keys && baseModelRow[fid].getPrimaryKey()){
			ind++;
			cond_key = cond_keys[ind];
		}
		else if (base_keys){
			for (ind=0;ind<base_keys.length;ind++){
				if (base_keys[ind]==fid){
					cond_key = cond_keys[ind];
					break;
				}
			}
		}
		
		if (cond_key){
			cond_fields = ( (cond_fields==undefined)? "":(cond_fields+contr.PARAM_FIELD_SEP_VAL) )+cond_key;
	
			cond_sgns = ( (cond_sgns==undefined)? "":(cond_sgns+contr.PARAM_FIELD_SEP_VAL) )+contr.PARAM_SGN_EQUAL;

			cond_vals = ( (cond_vals==undefined)? "":(cond_vals+contr.PARAM_FIELD_SEP_VAL) )+baseModelRow[fid].getValue();						
			
		}
	}	
			
	pm.setFieldValue(contr.PARAM_COND_FIELDS,cond_fields);
	pm.setFieldValue(contr.PARAM_COND_SGNS,cond_sgns);
	pm.setFieldValue(contr.PARAM_COND_VALS,cond_vals);
	pm.setFieldValue(contr.PARAM_FIELD_SEP,contr.PARAM_FIELD_SEP_VAL);
	this.onRefresh();		
}

