/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc Document view
 
 * @requires ../core/extend.js
 * @requires ViewObjectAjx.js     
  
 * @param {string} id - html tag id
 * @param {namespase} options
 * @param {bool} [options.processable=true]
 * @param {bool} [options.detailDataSetsExist=true] 
 * @param {Button} [options.controlOk=ButtonCmd]
 * @param {Button} [options.controlSave=ButtonCmd]
 * @param {Button} [options.controlCancel=ButtonCmd]       
 */
function ViewDOC(id,options){
	options = options || {};	

	this.setProcessable(options.processable || true);

	var self = this;

	//process document
	options.controlOk = options.controlOk || new ButtonCmd(id+":cmdOk",{	
		"caption":this.BTN_OK_CAP,
		"title":this.BTN_OK_TITLE,
		"onClick":function(){
			if (self.getProcessable()){
				self.getElement("processed").setValue(true);
			}
		
			self.onOK();
		},
		"app":options.app
	});

	//save document
	options.controlSave = options.controlSave || new ButtonCmd(id+":cmdSave",{	
		"caption":this.BTN_SAVE_CAP,
		"title":this.BTN_SAVE_TITLE,
		"onClick":function(){
			if (self.getProcessable() && !self.getElement("processed").getValue()){
				self.getElement("processed").setValue(false);
			}
		
			self.onSave();
		},
		"app":options.app
	});
	
	//close document
	options.controlCancel = options.controlCancel || new ButtonCmd(id+":cmdCancel",{
		"caption":this.BTN_CLOSE_CAP,
		"title":this.BTN_CLOSE_TITLE,	
		"onClick":function(){
			self.onCancel();
		},
		"app":options.app
	});

	this.m_detailDataSetsExist = (options.detailDataSetsExist!=undefined)? options.detailDataSetsExist:true;
	
	ViewDOC.superclass.constructor.call(this,id,options);
	
	this.addElement(new HiddenKey(id+":id"));
	
	if (this.getProcessable()){
		this.addElement(new HiddenKey(id+":processed",{}));
	}
	
	if (this.m_detailDataSetsExist){
		this.addElement(new HiddenKey(id+":view_id",{"value":CommonHelper.md5(CommonHelper.uniqid())}));
	}
	
}
extend(ViewDOC,ViewObjectAjx);

/* Constants */


/* private members */
ViewDOC.prototype.m_model;
ViewDOC.prototype.m_detailDataSetsExist;
ViewDOC.prototype.m_processable;

ViewDOC.prototype.addDetailDataSet = function(grid){	
	ViewDOC.superclass.addDetailDataSet.call(this,
		{"control":grid,
		"controlFieldId":"view_id",
		"value":this.getElement("view_id").getValue()//this.m_viewId
		}
	);
}

/* protected*/


/* public methods */
ViewDOC.prototype.getViewId = function(){
	return (this.m_detailDataSetsExist)? this.getElement("view_id").getValue():null;
	//this.m_viewId;
}

ViewDOC.prototype.setDetailKey = function(){
	//calling before open document
	var contr = this.getReadPublicMethod().getController();
	var doc_id = 0;
	if (this.getCmd()!="insert"){
		doc_id = this.getElement("id").getValue();
	}
	var pm = contr.getPublicMethod("before_open");
	pm.setFieldValue("doc_id",doc_id);
	pm.setFieldValue("view_id",this.getElement("view_id").getValue());
	pm.run({"async":false});

	ViewDOC.superclass.setDetailKey.call(this);
}

ViewDOC.prototype.getModified = function(cmd){	

	var modified = ViewDOC.superclass.getModified.call(this,cmd);
	
	if (!modified){
		if (this.m_detailDataSetsExist){
			for (var id in this.m_detailDataSets){
				if (this.m_detailDataSets[id].control.getModified()){
					modified = true;
					break;
				}
			}
		}
	}	
	return modified;
}

ViewDOC.prototype.addDefDataBindings = function(){
	//default fields	
	//read
	this.addDataBinding(new DataBinding({"control":this.getElement("id"),"model":this.m_model}));
	if (this.getProcessable()){
		this.addDataBinding(new DataBinding({"control":this.getElement("processed"),"model":this.m_model}));
	}
	
	//write
	var cmd_ok = this.getCommand(this.CMD_OK);
	cmd_ok.addBinding(new CommandBinding({"control":this.getElement("id")}));
	if (this.getProcessable()){
		cmd_ok.addBinding(new CommandBinding({"control":this.getElement("processed")}));
	}	
}

ViewDOC.prototype.execCommand = function(cmd,sucFunc,failFunc){	

	if (this.getCmd() == "insert"){
		var dt_ctrl = this.getElement("date_time");
		if (dt_ctrl){
			var dt_ctrl_val = dt_ctrl.getValue();
			
			if (dt_ctrl_val.getHours()==0 && dt_ctrl_val.getMinutes()==0 && dt_ctrl_val.getSeconds()==0){
				//defaul time
				tm = DateHelper.time();
				dt_ctrl_val.setHours(tm.getHours(),tm.getMinutes(),tm.getSeconds());
				dt_ctrl.setValue(dt_ctrl_val);
				
			}
		}
	}
	
	ViewDOC.superclass.execCommand.call(this,cmd,sucFunc,failFunc);
}

ViewDOC.prototype.beforeExecCommand = function(cmd,pm){

	ViewDOC.superclass.beforeExecCommand.call(this,cmd,pm);
	
	if (this.m_detailDataSetsExist && pm.fieldExists("view_id")){
		pm.setFieldValue("view_id",this.getViewId());
	}	
}

ViewDOC.prototype.getProcessable = function(){	
	return this.m_processable;
}
ViewDOC.prototype.setProcessable = function(v){	
	this.m_processable = v;
}

ViewDOC.prototype.onSaveOk = function(resp){

	ViewDOC.superclass.onSaveOk.call(this,resp);
	
	if (this.m_detailDataSetsExist){
		for (var id in this.m_detailDataSets){
			this.m_detailDataSets[id].control.setModified(false);
		}
	}
	
}
