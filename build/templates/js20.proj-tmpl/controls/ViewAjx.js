/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2014
 
 * @class
 * @classdesc Ajax based visual view. Adds ajax support, control bindings,commands execution
 
 * @requires core/extend.js
 * @requires core/ControlContainer.js     
  
 * @param {string} id - html tag id
 * @param {object} options
 * @param {function} options.onBeforeExecCommand
 * @param {object} options.commands 
 */
function ViewAjx(id,options){
	options = options || {};
	
	this.setCommands(options.commands || {});
	
	this.setOnBeforeExecCommand(options.onBeforeExecCommand);
	
	ViewAjx.superclass.constructor.call(this,id,options);
}
extend (ViewAjx,View);

/* Constants */


/* Private */
ViewAjx.prototype.m_commands;
ViewAjx.prototype.m_cmdCtrlState;
ViewAjx.prototype.m_onBeforeExecCommand;


ViewAjx.prototype.defineField = function(i){
	var f = this.m_dataBindings[i].getField();
	var m = this.m_dataBindings[i].getModel();
	if(!f && this.m_dataBindings[i].getFieldId() && m.fieldExists(this.m_dataBindings[i].getFieldId())){
		this.m_dataBindings[i].setField(m.getField(this.m_dataBindings[i].getFieldId()));
	}
	else if(!f && this.m_dataBindings[i].getControl() && m.fieldExists(this.m_dataBindings[i].getControl().getName())){
		this.m_dataBindings[i].setField(m.getField(this.m_dataBindings[i].getControl().getName()));
	}
}

/** protected
 * @param {ServResponse} resp can be undefined for simple copying data from model to controls
 * @param {string} copy/edit/insert

 * Description
 *	field resolving order:
 *		this.m_dataBindings[].field
 *		this.m_dataBindings[].fieldId
 *		this.m_dataBindings[].control.getName()
 *	othrewise skeeped
 */
ViewAjx.prototype.onGetData = function(resp,cmd){	
	//backward compatibility
	cmd = (cmd===true)? "copy":cmd;
	var cmdCopy = (cmd=="copy");
	var cmdInsert = (cmd=="insert");
	
	var models = {};
	//console.log("ViewAjx.prototype.onGetData.cmdCopy="+cmdCopy)
	for (var i=0;i<this.m_dataBindings.length;i++){
	//console.log("dataBindings i="+i)
		var m = this.m_dataBindings[i].getModel();		
		if (!m){
			throw new Error(CommonHelper.format(this.ER_NO_BINDING_MODEL,[i]));
		}
		var m_id = m.getId();
		if (models[m_id]==undefined && resp && resp.modelExists(m_id)){
			m.setData(resp.getModelData(m_id));
			models[m_id] = m.getRowCount();
			m.getNextRow();//first row
		}
		else if (models[m_id]==undefined && !resp){
			models[m_id] = m.getRowCount();
			if (models[m_id]){
				m.getNextRow();//first row		
			}
		}
		if (models[m_id]>0){	
			var ctrl = this.m_dataBindings[i].getControl();
			if (ctrl){
			//console.log("Got control")
				var init_val = null;
				var ctrl_format_f = (ctrl.getFormatFunction)? ctrl.getFormatFunction():null;
				
				if (ctrl_format_f){
					init_val = ctrl_format_f.call(ctrl,this.m_dataBindings[i].getModel().getFields());
				}
				else{
					//debugger;
					this.defineField(i);
					//console.log("ViewAjx.prototype.onGetData defineField")
					if (this.m_dataBindings[i].getField() && !(cmdCopy && this.m_dataBindings[i].getField().getPrimaryKey()) ){						
						init_val = this.m_dataBindings[i].getField().getValue();						
						//console.log("ViewAjx.prototype.onGetData init_val="+init_val)
					}			
				}
				//console.log("Setting init value "+ctrl.getId()+" val="+init_val)
				if (init_val!=undefined && (!ctrl.getIsRef || !ctrl.getIsRef()) ){
					if (ctrl.setInitValue && !cmdCopy && !cmdInsert){
						ctrl.setInitValue(init_val);
					}
					else{
						//simple none edit controls
						ctrl.setValue(init_val);
					}
				}
				else if (ctrl.getIsRef && ctrl.getIsRef() && this.m_dataBindings[i].getKeyIds()){
					var init_val_o;
					if (init_val!=undefined && typeof(init_val)=="object"){
						//RefType object
						init_val_o = init_val;
					}
					else{
						var key_ids = this.m_dataBindings[i].getKeyIds();						
						if (!key_ids){
							throw Error(CommonHelper.format(this.ER_CTRL_KEYS_NOT_BOUND,[ctrl.getName()]));	
						}
						//@ToDo !!!CHECK!!!
						var m_keys;
						//For EditSELECT!!!
						if (ctrl.getModelKeyFields){
							m_keys = ctrl.getModelKeyFields();
						}
						var keys = {};
						for (var n=0;n<key_ids.length;n++){
							var k_id;
							if (m_keys){
								k_id = m_keys[n].getId();
							}
							else{
								k_id = key_ids[n];
							}							
							keys[k_id] = m.getFieldValue(key_ids[n]);
						}					
						init_val_o = new RefType({
							"keys":keys,
							"descr":init_val,
							"dataType":undefined
						});
					}
					if (ctrl.setInitValue && !cmdCopy && !cmdInsert){
						ctrl.setInitValue(init_val_o);
					}
					else{
						ctrl.setValue(init_val_o);
					}
				}
			}
		}
	}
	this.setReadTempEnabled();
}

ViewAjx.prototype.setTempDisabled = function(cmd){
	if (this.m_commands[cmd]){
		var cmd_ctrl = this.m_commands[cmd].getControl();
		if (cmd_ctrl){
			this.m_cmdCtrlState = cmd_ctrl.getEnabled();
			cmd_ctrl.setEnabled(false);
		}
	}	
	this.m_controlStates = {};
	this.m_controlStates[cmd] = [];
	if (this.m_commands[cmd].getBindings()){
		var b = this.m_commands[cmd].getBindings();
		for (var i=0;i < b.length;i++){
			var ctrl = b[i].getControl();
			//console.log(ctrl.getName());
			this.m_controlStates[cmd].push({
				"ctrl":ctrl,
				"enabled":ctrl.getEnabled(),
				"inputEnabled":(ctrl.getInputEnabled)? ctrl.getInputEnabled():true
			});
			ctrl.setEnabled(false);
		}	
	}	
}

ViewAjx.prototype.setTempEnabled = function(cmd){
	if (this.m_commands[cmd]){
		var cmd_ctrl = this.m_commands[cmd].getControl();
		if (cmd_ctrl && this.m_cmdCtrlState){
			cmd_ctrl.setEnabled(true);
		}
	}
	if (this.m_controlStates && this.m_controlStates[cmd]){
		for (var i=0;i<this.m_controlStates[cmd].length;i++){
			if (this.m_controlStates[cmd][i].enabled){
				this.m_controlStates[cmd][i].ctrl.setEnabled(true);
			}
			if (this.m_controlStates[cmd][i].ctrl.setInputEnabled){
				this.m_controlStates[cmd][i].ctrl.setInputEnabled(this.m_controlStates[cmd][i].inputEnabled);
			}
		}
	}
}


ViewAjx.prototype.getModified = function(cmd){
	if (this.m_commands[cmd].getBindings()){
		var b = this.m_commands[cmd].getBindings();
		for (var i=0;i < b.length;i++){
			//&& b[i].getControl().getEnabled()
			if (b[i].getControl() && b[i].getControl().getModified()){
			//console.log("Modified "+b[i].getControl().getId())
				return true;
			}
		}
	}
}


/* public methods */

/**
 * @param {string} cmd
 * @param {object} res {{object}old_keys, {bool}incorrect_vals, {bool}modified}
 */
ViewAjx.prototype.validate = function(cmd,validate_res){
	validate_res = validate_res || {};
	validate_res.incorrect_vals = false;
		
	var pm = this.m_commands[cmd].getPublicMethod();
	if (!pm){
		throw Error(this.ER_NO_PM);
	}	
	var bindings = this.m_commands[cmd].getBindings();
	if (bindings && bindings.length){		
		this.resetError();	
						
		for (var i=0;i<bindings.length;i++){			
			var bind = bindings[i];
			var ctrl = bind.getControl();
			if (!ctrl){
				throw Error(CommonHelper.format(this.ER_NO_CTRL,[cmd,i]));	
			}
			var f = bind.getField();			
			if (!f && bind.getFieldId()){
				//field id is defined
				f = pm.getField(bind.getFieldId());
			}
			else if(!f && pm.fieldExists(ctrl.getName())){
				//no field or field id, but there is a field with the same id as control
				f = pm.getField(ctrl.getName());
			}
			else if (!f){
				throw Error(CommonHelper.format(this.ER_CTRL_NOT_BOUND,[ctrl.getName()]));	
			}
			if (ctrl.getModified && ctrl.getModified()){			
				//is it an object field?
				if (ctrl.getIsRef && ctrl.getIsRef()
				&& !(f.getDataType()==Field.prototype.DT_JSON || f.getDataType()==Field.prototype.DT_JSONB)
				){			
					//reference field with keys					
					var keyIds = ctrl.getKeyIds();
					if (keyIds.length>=1){
						f.setValue(ctrl.getKeys()[keyIds[0]]);
						modified = true;
					}
				}
				else{
					//simple field
					var val = ctrl.getValue();
					if (ctrl.setValid)ctrl.setValid();
					
					try{
						if (ctrl.getValidator && ctrl.getValidator())ctrl.getValidator().validate(val);
						
						if (ctrl.getRequired && ctrl.getRequired() && val===null){
							throw new Error(f.getValidator().ER_EMPTY);
						}
						f.setValue(val);
						modified = true;						
					}
					catch(e){
						if (ctrl.setNotValid)ctrl.setNotValid(e.message);
						validate_res.incorrect_vals = true;
					}							
				}
			}
			else if (ctrl.isNull && ctrl.isNull() && (ctrl.getRequired() || f.getValidator().getRequired()) && ctrl.setNotValid){
				ctrl.setNotValid(f.getValidator().ER_EMPTY);
				validate_res.incorrect_vals = true;				
			}
			else if (ctrl instanceof EditFile){
				//??? always reset files ??? All reset to deffault values
				f.resetValue();
			}
				
			//setting old keys for update
			if (validate_res.old_keys && !validate_res.incorrect_vals && f.getPrimaryKey() && pm.fieldExists(f.getOldId())){
				//pm.setFieldValue(f.getOldId(),ctrl.getInitValue());
				var init_val = ctrl.getInitValue();				
				if (typeof init_val =="object"){
					if  (init_val instanceof RefType){
						init_val = init_val.getKey();
					}
					else{
						for (var init_val_id in init_val){
							init_val = init_val[init_val_id];
							break;
						}						
					}					
				}
				validate_res.old_keys[f.getOldId()] = init_val;
			}			
		}
	}
	return !validate_res.incorrect_vals;
}

ViewAjx.prototype.execCommand = function(cmd,sucFunc,failFunc){
	if (!this.m_commands[cmd]){
		throw Error(this.ER_CMD_NOT_FOUND);
	}
	var pm = this.m_commands[cmd].getPublicMethod();
	if (!pm){
		throw Error(this.ER_NO_PM);
	}
	
	var validate_res = {
		"incorrect_vals" : false,
		"modified" : this.getModified(cmd),
		"old_keys" : {}
	};
	//var pm_modified = false;
	if (!validate_res.modified){
		var pm_fields = pm.getFields();
		for (var fid in pm_fields){
			if (pm_fields[fid].isSet()){
				validate_res.modified = true;
				break;
			}
		}
	}
	
	if (validate_res.modified){
		this.validate(cmd,validate_res);
	}
	
	if (validate_res.incorrect_vals){
		this.setError(this.ER_ERRORS);
	}
	else if (validate_res.modified){
		if (!this.m_commands[cmd].getAsync()){
			this.setTempDisabled(cmd);
		}
		
		//old keys for update
		for (oldid in validate_res.old_keys){
			pm.setFieldValue(oldid,validate_res.old_keys[oldid]);
		}
		
		var self = this;
		try{			
			this.beforeExecCommand(cmd,pm);
			pm.run({
				"async":this.m_commands[cmd].getAsync(),
				"ok":function(resp){
					if (!self.m_commands[cmd].getAsync()){
						self.setTempEnabled(cmd);
					}
					if (sucFunc){
						sucFunc.call(this,resp);
					}	
				},
				"fail":function(resp,errCode,errStr){
					self.onRequestFail(failFunc,cmd,resp,errCode,errStr);
				}
			});
		}
		catch(e){
			this.onRequestFail(failFunc,cmd,null,null,e.message);
		}
	}
	else{
		//not modified
		if (sucFunc){
			sucFunc.call(this,null);
		}
	}
	
}

ViewAjx.prototype.onRequestFail = function(failFunc,cmd,resp,errCode,errStr){
	this.setTempEnabled(cmd);	
	if (failFunc){
		failFunc.call(this,resp,errCode,errStr);
	}
	else{
		this.setError(window.getApp().formatError(errCode,errStr));
	}	
}


ViewAjx.prototype.getCommands = function(){
	return this.m_commands; 
}

ViewAjx.prototype.setCommands = function(v){
	this.m_commands = v; 
}

/**
 * @param Command command, 
 */
ViewAjx.prototype.addCommand = function(cmd){
	this.m_commands[cmd.getId()] = cmd; 
}

ViewAjx.prototype.getCommand = function(id){
	return this.m_commands[id]; 
}

/**
 * @param {DOMNode} parent
 * @param {string} cmd
 */
ViewAjx.prototype.toDOM = function(parent,cmd){
	//backward compatibility
	cmd = (cmd===true)? "copy":cmd;

//console.log("ViewAjx.prototype.toDOM cmd="+cmd)
	ViewAjx.superclass.toDOM.call(this,parent);
	
	this.onGetData(null,cmd);
}

ViewAjx.prototype.beforeExecCommand = function(cmd,pm){
	if (this.getOnBeforeExecCommand()){
		this.getOnBeforeExecCommand().call(this,cmd,pm);
	}
}

ViewAjx.prototype.setOnBeforeExecCommand = function(v){
	this.m_onBeforeExecCommand = v;
}

ViewAjx.prototype.getOnBeforeExecCommand = function(v){
	return this.m_onBeforeExecCommand;
}

