/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
* @requires controls/ControlContainer.js 
*/

/* constructor */
function GridFilter(id,options){
	options = options || {};
	var tagName = options.tagName || this.DEF_TAG_NAME;
	options.className = options.className || this.DEF_CLASS_NAME;
	GridFilter.superclass.constructor.call(this,
		id,tagName,options);
	
	if (options.onRefresh){
		this.setOnRefresh(options.onRefresh);
	}
	if (options.clickContext){
		this.setClickContext(options.clickContext);
	}
	
	var self = this;
	this.m_filter = new ListFilter();
	
	//other controls
	this.m_commandControls = {};
	
	//predefined controls
	this.m_setControl = new Button(null,
	{"caption":options.setControlCaption || this.DEF_SET_CTRL_CAP,
	"onClick":function(){		
		var grid = self.m_clickContext;
		self.unsetGridFromParam(grid);
		self.m_onRefresh.call(grid);
		},
	"className":"viewBtn"
	});
	
	//options.noUnsetControl = options.noUnsetControl || true;
	if (options.noUnsetControl!=undefined&&options.noUnsetControl==false){
		this.m_unsetControl = new Button(null,
		{"caption":options.unsetControlCaption || this.DEF_UNSET_CTRL_CAP,
		"onClick":function(){
			var params = self.m_filter.m_params;
			for (var ctrl_id in params){
				self.m_elements[ctrl_id].resetValue();
				/*
				var val = params[ctrl_id].iniValue;
				self.m_elements[ctrl_id].setValue(val);
				if (params[ctrl_id].keyFieldIds){
					for (var i=0;i<params[ctrl_id].keyFieldIds.length;i++){
						var key = params[ctrl_id].keyFieldIds[i];
						self.m_elements[ctrl_id].setAttr("fkey_"+key,"");
					}
				}
				*/
			}
			var grid = self.m_clickContext;
			self.unsetGridFromParam(grid);
			self.m_onRefresh.call(grid);
		},
		"className":"viewBtn"
		});	
	}
}
extend(GridFilter,ControlContainer);

GridFilter.prototype.DEF_TAG_NAME = "div";
GridFilter.prototype.DEF_CLASS_NAME = 'grid_filter';
GridFilter.prototype.DEF_SET_CTRL_CAP = "Применить";
GridFilter.prototype.DEF_UNSET_CTRL_CAP = "Сбросить";

GridFilter.prototype.m_onRefresh;
GridFilter.prototype.m_clickContext;
GridFilter.prototype.m_setControl;
GridFilter.prototype.m_unsetControl;
GridFilter.prototype.m_filter;

GridFilter.prototype.setOnRefresh = function(onRefresh){
	this.m_onRefresh = onRefresh;
}
GridFilter.prototype.setClickContext = function(clickContext){
	this.m_clickContext = clickContext;
}
GridFilter.prototype.toDOM = function(parent){
	this.m_container = new Control(null,"div",{"className":"grid_filter_cont"});
	GridFilter.superclass.toDOM.call(this,this.m_container.m_node);
	
	this.m_containerCMD = new Control(null,"div",{"className":"grid_filter_cmd_cont"});
	if (this.m_setControl){
		this.m_setControl.toDOM(this.m_containerCMD.m_node);
	}
	if (this.m_unsetControl){
		this.m_unsetControl.toDOM(this.m_containerCMD.m_node);
	}
	for (var id in this.m_commandControls){
		this.m_commandControls[id].toDOM(this.m_containerCMD.m_node);
	}
	this.m_containerCMD.toDOM(this.m_container.m_node);
	this.m_container.toDOM(parent);
}
GridFilter.prototype.removeDOM = function(){		
	if (this.m_setControl){
		this.m_setControl.removeDOM();
	}
	if (this.m_unsetControl){
		this.m_unsetControl.removeDOM();	
	}
	for (var id in this.m_commandControls){
		this.m_commandControls[id].removeDOM();
	}	
	this.m_containerCMD.removeDOM();
	GridFilter.superclass.removeDOM.call(this);
	this.m_container.removeDOM();
}
GridFilter.prototype.addFilterControl = function(control,filter){		
	this.m_filter.addFilter(control.getId(),filter);
	this.addElement(control);
}
GridFilter.prototype.getFilterControlById = function(id){		
	return this.m_filter.getFilterById(id);
}
GridFilter.prototype.unsetFilterControlById = function(id){
	this.m_filter.unsetFilterById(id);
}

GridFilter.prototype.getParams = function(struc){		
	for (var ctrl_id in this.m_elements){
		var keys = this.m_filter.m_params[ctrl_id].keyFieldIds;
		if (keys){
			for (var i=0;i<keys.length;i++){
				var key;
				if (this.m_elements[ctrl_id].getFieldValue){
					key = this.m_elements[ctrl_id].getFieldValue(keys[i]);
				}
				else{
					key = this.m_elements[ctrl_id].getAttr("fkey_"+keys[i]);
				}			
				this.m_filter.m_params[ctrl_id].key = key;
			}
		}
		this.m_filter.m_params[ctrl_id].descr = 
			this.m_elements[ctrl_id].getValue();
	}
	this.m_filter.getParams(struc);
}
GridFilter.prototype.setFocus = function(){
	for (var elem_id in this.m_elements){
		this.m_elements[elem_id].m_node.focus();
		break;
	}
}
GridFilter.prototype.unsetGridFromParam = function(grid){
	if (grid.m_controller){		
		if (grid.m_pagination){
			grid.m_pagination.setFrom(0);
		}
	}
}
GridFilter.prototype.addCommandControl = function(control){
	this.m_commandControls[control.getId()] = control;
}