/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc
	
 * @param {string} id view identifier
 * @param {namespace} options
 * @param {namespace} [options.tagName=this.DEF_TAG_NAME]
 * @param {namespace} [options.columnTagName=this.DEF_COL_TAG_NAME] 
 * @param {string} [cmdContClassName=DEF_CMD_CLASS]
 */	

function ViewGridEditInlineAjx(id,options){
	options = options || {};	
	
	options.tagName = options.tagName || this.DEF_TAG_NAME;
	options.cmdSave = false;
	
	this.m_columnTagName = 	options.columnTagName || this.DEF_COL_TAG_NAME;
	options.commandContainer = new ControlContainer(id+":cmd-cont",this.m_columnTagName,{"className":options.cmdContClassName||this.DEF_CMD_CLASS});
	
	this.setGrid(options.grid);
	
	this.setKeys(options.keys);
	
	this.m_row = options.row;
	
	ViewGridEditInlineAjx.superclass.constructor.call(this,id,options);
		
//	this.addControls();		
}
extend(ViewGridEditInlineAjx,ViewObjectAjx);

/* Constants */
ViewGridEditInlineAjx.prototype.DEF_TAG_NAME = "TR";
ViewGridEditInlineAjx.prototype.DEF_COL_TAG_NAME = "TD";
ViewGridEditInlineAjx.prototype.DEF_CMD_CLASS = "cmdButtons";

/* private members */
ViewGridEditInlineAjx.prototype.m_grid;
ViewGridEditInlineAjx.prototype.m_row;
ViewGridEditInlineAjx.prototype.m_columnTagName;

/* protected*/

/* Default controls */
ViewGridEditInlineAjx.prototype.addEditControls = function(){	
	var view_id = this.getId();	
	var columns = this.getGrid().getHead().getColumns();
	var focus_set = false;
	
	for (var col_id=0;col_id<columns.length;col_id++){
	
		var column = undefined;
		
		if (this.m_row){
			cell_obj = this.m_row.getElement(columns[col_id].getId());			
			if (cell_obj){			
				column = cell_obj.getGridColumn();
			}
		}
		
		if (!column){
			column = columns[col_id]; 
		}

		var ctrl_opts = (column.getCtrlOptions()!=undefined)? CommonHelper.clone(column.getCtrlOptions()) : {};
		ctrl_opts.visible = columns[col_id].getHeadCell().getVisible();
		/*
		var ctrl_opts = {
			"visible":columns[col_id].getHeadCell().getVisible()
		};
		CommonHelper.merge(ctrl_opts,column.getCtrlOptions());
		*/
		
		var f = column.getField();
		if (!f){
			continue;
		}
		
		var ctrl;
		if (column.getCtrlEdit()){
			var ctrl_class = column.getCtrlClass();		
			if (!ctrl_class){
				//Default control classes based on data types		
				var tp = f.getDataType();
				if (tp==f.DT_BOOL){
					ctrl_class = EditCheckBox;
				}
				else if (tp==f.DT_DATE){
					ctrl_class = EditDate;
				}
				else if (tp==f.DT_DATETIME){
					ctrl_class = EditDateTime;
				}
				else if (tp==f.DT_ENUM){
					ctrl_class = EditSelect;
				}
				else if (tp==f.DT_FLOAT){
					ctrl_class = EditFloat;
				}
				else if (tp==f.DT_INT){
					ctrl_class = EditInt;
				}
				else if (tp==f.DT_STRING){
					ctrl_class = EditString;
				}
				else if (tp==f.DT_PWD){
					ctrl_class = EditPassword;
				}
				else if (tp==f.DT_TEXT){
					ctrl_class = EditText;
				}
				else{
					ctrl_class = EditString;
				}			
			}				
			if (f.getValidator().getMaxLength()){
				ctrl_opts.maxLength = f.getValidator().getMaxLength();
			}
			if (f.getValidator().getRequired()){
				ctrl_opts.required = true;
			}
					
			var focus_skeep = false;
			if (f.getPrimaryKey()){
				ctrl_opts.noSelect = true;
				ctrl_opts.noClear = true;
				focus_skeep = f.getAutoInc();
			}
			if (!focus_skeep && !focus_set){
				ctrl_opts.autofocus = true;
				focus_set = true;
			}
			ctrl = new ctrl_class(view_id+":"+column.getId(),ctrl_opts)
		}
		else{
			//can not be editted
			ctrl = new Control(null,this.m_columnTagName,{"value":f.getValue()});
		}		
		this.addElement(ctrl);		
	}
	
}

ViewGridEditInlineAjx.prototype.addControls = function(){
	
	this.addEditControls();
	
	ViewGridEditInlineAjx.superclass.addControls.call(this);
}

ViewGridEditInlineAjx.prototype.setKeysPublicMethod = function(pm){	
	for (var k in this.m_keys){
		var fid = "old_"+k;
		if (pm.fieldExists(fid)){
			pm.setFieldValue(fid,this.m_keys[k]);
		}
	}		
}

ViewGridEditInlineAjx.prototype.setWritePublicMethod = function(pm){	

	ViewGridEditInlineAjx.superclass.setWritePublicMethod.call(this,pm);
	
	if (pm){
		var columns = this.getGrid().getHead().getColumns();
		var com_b = this.getCommands()[this.CMD_OK].getBindings();		
		for (var col_id=0;col_id<columns.length;col_id++){
			//write
			//var f_id = (columns[col_id].getWFieldId())? columns[col_id].getWFieldId():columns[col_id].getField().getId();
			
			var column = undefined;
			if (this.m_row){
				cell_obj = this.m_row.getElement(columns[col_id].getId());
				if (cell_obj){
					column = cell_obj.getGridColumn();
				}
			}
			if (!column){
				column = columns[col_id]; 
			}
			
			if (column.getField()){
				var f_id = (column.getCtrlBindField())?
					column.getCtrlBindField().getId() : 
						(
							(column.getCtrlBindFieldId())?
								column.getCtrlBindFieldId() : column.getField().getId()
						);
				//console.log("ViewGridEditInlineAjx.prototype.setWritePublicMethod FId="+f_id+" BindFieldId="+column.getCtrlBindFieldId());
				if (pm.fieldExists(f_id)){
					com_b.push(new CommandBinding({
						"field":pm.getField(f_id),
						"control":this.getElement(column.getId())
					}));
					//console.log("ViewGridEditInlineAjx.prototype.setWritePublicMethod Added FId="+f_id);
				}
			}
		}
		
		this.setKeysPublicMethod(pm);
	}
}

/* public methods */

ViewGridEditInlineAjx.prototype.setReadBinds = function(pm){
	if (pm){
		//var model = new ModelXML(pm.getController().getObjModelId());
		var model_obj = pm.getController().getObjModelClass();
		var model = new model_obj();
		var columns = this.getGrid().getHead().getColumns();
		var bindings = [];
		for (var col_id=0;col_id<columns.length;col_id++){
		
			var column = undefined;
			
			if (this.m_row){
				cell_obj = this.m_row.getElement(columns[col_id].getId());
				if (cell_obj){
					column = cell_obj.getGridColumn();
				}
			}
			if (!column){
				column = columns[col_id]; 
			}
		
			if (column.getField()){
			
				var new_f = CommonHelper.clone(column.getField());
				//var new_f = column.getField();
				//model.addField(new_f);
				
				if (column.getCtrlBindField()){
					//id field
					model.addField(CommonHelper.clone(column.getCtrlBindField()));
					//model.addField(column.getCtrlBindField());
				}
				/*
				else if (column.getCtrlBindFieldId()){
					model.addField(new FieldString(column.getCtrlBindFieldId()));
				}
				*/
				bindings.push(new DataBinding({
					"field":new_f,
					"model":model,
					"control":this.getElement(column.getId())
				}));
			}
		}
		this.setDataBindings(bindings);	
	}
}

ViewGridEditInlineAjx.prototype.setReadPublicMethod = function(pm){

	ViewGridEditInlineAjx.superclass.setReadPublicMethod.call(this,pm);
	
	this.setReadBinds(pm);
}

//,replacedNode
ViewGridEditInlineAjx.prototype.toDOM = function(parent){
	var elem;
	for (var elem_id in this.m_elements){
		elem = this.m_elements[elem_id];
		elem.toDOM(this.m_node);
	}
	
	//sys column
	this.m_commandContainer.toDOM(this.m_node);
	
	if (this.m_replacedNode){
		/*
		var prev = this.m_replacedNode.nextSibling;
		parent.removeChild(this.m_replacedNode);
		if (prev){
			parent.insertBefore(this.m_node,prev);
		}
		else{
			parent.appendChild(this.m_node);
		}
		*/
		this.m_replacedNode.parentNode.replaceChild(this.m_node,this.m_replacedNode);
	}
	else{
		var rows = parent.getElementsByTagName(this.m_node.nodeName);
		if (rows.length==0){
			parent.appendChild(this.m_node);
		}
		else{			
			parent.insertBefore(this.m_node,rows[0]);
		}
	}
	
	this.setFocus();
	this.addKeyEvents();
}

ViewGridEditInlineAjx.prototype.setGrid = function(v){
	this.m_grid = v;
}
ViewGridEditInlineAjx.prototype.getGrid = function(){
	return this.m_grid;
}
ViewGridEditInlineAjx.prototype.setKeys = function(v){
	this.m_keys = v;
}
ViewGridEditInlineAjx.prototype.getKeys = function(){
	return this.m_keys;
}

ViewGridEditInlineAjx.prototype.getReplacedNode = function(){
	return this.m_replacedNode;
}

ViewGridEditInlineAjx.prototype.addElement = function(ctrl,defOptions){
	if ((!defOptions || !defOptions.contTagName) && ctrl.setContTagName){
		ctrl.setContTagName(this.m_columnTagName);
	}
	if ((!defOptions || !defOptions.editContClassName) && ctrl.setEditContClassName){
		ctrl.setEditContClassName(ctrl.DEF_EDIT_CONT_CLASS+" "+window.getBsCol(12));
	}
//console.log("CtrlId="+ctrl.getId()+" ContTagName="+ctrl.getContTagName())
	ViewGridEditInlineAjx.superclass.addElement.call(this,ctrl);
}
