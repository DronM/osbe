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

/* protected
@param ServResponse resp can be undefined for simple copying data from model to controls
@param string cmd insert||edit||copy

Description
	field resolving order:
		this.m_dataBindings[].field
		this.m_dataBindings[].fieldId
		this.m_dataBindings[].control.getName()
	othrewise skeeped
*/
ViewAjx.prototype.onGetData = function(resp,cmd){	
	var models = {};
	for (var i=0;i<this.m_dataBindings.length;i++){
	//console.log("dataBindings i="+i)
		var m = this.m_dataBindings[i].getModel();		
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
					if (this.m_dataBindings[i].getField() && !(cmd=="copy" && f.getPrimaryKey()) ){						
						init_val = this.m_dataBindings[i].getField().getValue();						
						//console.log("ViewAjx.prototype.onGetData init_val="+init_val)
					}			
				}
				
				if (init_val && (!ctrl.getIsRef || !ctrl.getIsRef()) ){
					if (ctrl.setInitValue){
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
							throw Error(CommonHelper.format(this.ER_CTRL_KEYS_NOT_BOUND,Array(ctrl.getName())));	
						}
						var keys = {};
						for (var n=0;n<key_ids.length;n++){
							keys[key_ids[n]] = m.getFieldValue(key_ids[n]);
						}					
						init_val_o = new RefType({
							"keys":keys,
							"descr":init_val
						});
					}
					ctrl.setInitValue(init_val_o);
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
			if (b[i].getControl() && b[i].getControl().getModified()){
				return true;
			}
		}
	}
}


/* public methods */

ViewAjx.prototype.execCommand = function(cmd,sucFunc,failFunc){
	if (!this.m_commands[cmd]){
		throw Error(this.ER_CMD_NOT_FOUND);
	}
	var pm = this.m_commands[cmd].getPublicMethod();
	if (!pm){
		throw Error(this.ER_NO_PM);
	}
	
	var incorrect_vals = false;
	var modified = this.getModified(cmd);
	//var pm_modified = false;
	if (!modified){
		var pm_fields = pm.getFields();
		for (var fid in pm_fields){
			if (pm_fields[fid].isSet()){
				modified = true;
				break;
			}
		}
	}
	
	this.resetError();	
	
	//old keys for update
	var old_keys = {};
	
	if (modified && this.m_commands[cmd].getBindings()){		
		var bindings = this.m_commands[cmd].getBindings();
		for (var i=0;i<bindings.length;i++){			
			var bind = bindings[i];
			var ctrl = bind.getControl();
			if (!ctrl){
				throw Error(CommonHelper.format(this.ER_NO_CTRL,Array(cmd,i)));	
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
				throw Error(CommonHelper.format(this.ER_CTRL_NOT_BOUND,Array(ctrl.getName())));	
			}
			if (ctrl.getModified && ctrl.getModified()){
				//is it an object field?
				if (ctrl.getIsRef && ctrl.getIsRef()){			
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
					ctrl.setValid();
					
					try{
						if (ctrl.getValidator && ctrl.getValidator())ctrl.getValidator().validate(val);
						
						if (ctrl.getRequired && ctrl.getRequired() && val===null){
							throw new Error(f.getValidator().ER_EMPTY);
						}
						f.setValue(val);
						modified = true;						
					}
					catch(e){
						ctrl.setNotValid(e.message);
						incorrect_vals = true;
					}							
				}
			}
			else if (ctrl.isNull && ctrl.isNull() && (ctrl.getRequired() || f.getValidator().getRequired())){
				ctrl.setNotValid(f.getValidator().ER_EMPTY);
				incorrect_vals = true;				
			}
			
			//setting old keys for update
			if (!incorrect_vals && f.getPrimaryKey() && pm.fieldExists(f.getOldId())){
				//pm.setFieldValue(f.getOldId(),ctrl.getInitValue());
				old_keys[f.getOldId()] = ctrl.getInitValue();
			}			
		}
	}
	if (incorrect_vals){
		this.setError(this.ER_ERRORS);
	}
	else if (modified){
		if (!this.m_commands[cmd].getAsync()){
			this.setTempDisabled(cmd);
		}
		
		//old keys for update
		for (oldid in old_keys){
			pm.setFieldValue(oldid,old_keys[oldid]);
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

/*
@param Command command, 
*/
ViewAjx.prototype.addCommand = function(cmd){
	this.m_commands[cmd.getId()] = cmd; 
}

ViewAjx.prototype.getCommand = function(id){
	return this.m_commands[id]; 
}

ViewAjx.prototype.toDOM = function(parent){

	ViewAjx.superclass.toDOM.call(this,parent);
	
	this.onGetData();
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

