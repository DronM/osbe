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
	
	if (!TEMPLATE_PARAMS[id]){
		TEMPLATE_PARAMS[id] = {};
	}
	
	//predefined controls
	if (options.noSetControl==undefined || (options.noSetControl!=undefined && options.noSetControl==false)){
		this.m_setControl = new ButtonCmd(null,
		{"caption":options.setControlCaption || this.DEF_SET_CTRL_CAP,
		"attrs":{"title":"установить отбор"},
		"onClick":function(){
			var id = self.getId();
			for (var ctrl_id in self.m_elements){
				TEMPLATE_PARAMS[id][ctrl_id] = self.m_elements[ctrl_id].serialize();
			}
			self.refresh();
		}
		});
	}
		
	if (!options.noUnsetControl||(options.noUnsetControl!=undefined&&options.noUnsetControl==false)){
		this.m_unsetControl = new ButtonCmd(null,
		{"caption":options.unsetControlCaption || this.DEF_UNSET_CTRL_CAP,
		"attrs":{"title":"отменить отбор"},
		"onClick":function(){
			self.resetValues();
		}
		});	
	}
	
	if (options.noToggleControl==undefined || (options.noToggleControl!=undefined && options.noToggleControl==false)){
		this.m_btnToggle = new ButtonCtrl(uuid(),{
			"attrs":{
				"data-toggle":"collapse",
				"data-target":("#"+this.getId())
				},
			"caption":options.toggleBtnCaption||"Отбор",
			"glyph":"glyphicon-triangle-bottom"
			/*
			,
			"onClick":function(){
				var n = self.getNode();
				var inputs = n.getElementsByTagName("input");
				if (inputs.length){
					inputs[0].focus();
				}
			}
			*/
			});	
	}
}
extend(GridFilter,ControlContainer);

GridFilter.prototype.DEF_TAG_NAME = "form";
GridFilter.prototype.DEF_CLASS_NAME = "form-horizontal collapse";
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
	if (this.m_btnToggle)this.m_btnToggle.toDOM(parent);
	
	GridFilter.superclass.toDOM.call(this,parent);
	
	if (this.m_setControl){
		this.m_setControl.toDOM(this.getNode());
	}
	if (this.m_unsetControl){
		this.m_unsetControl.toDOM(this.getNode());
	}
	for (var id in this.m_commandControls){
		this.m_commandControls[id].toDOM(this.getNode());
	}
}
GridFilter.prototype.removeDOM = function(){		
	if (this.m_btnToggle)this.m_btnToggle.removeDOM();
	
	if (this.m_setControl){
		this.m_setControl.removeDOM();
	}
	if (this.m_unsetControl){
		this.m_unsetControl.removeDOM();	
	}
	for (var id in this.m_commandControls){
		this.m_commandControls[id].removeDOM();
	}	
	GridFilter.superclass.removeDOM.call(this);
}
GridFilter.prototype.addFilterControl = function(control,filter){		
	var ctrl_id = control.getId();
	var id = this.getId();
	
	if (TEMPLATE_PARAMS[id] && TEMPLATE_PARAMS[id][ctrl_id]){
		control.unserialize(TEMPLATE_PARAMS[id][ctrl_id]);
	}
		
	this.m_filter.addFilter(ctrl_id,filter);
	this.addElement(control);
}
GridFilter.prototype.getFilterControlById = function(id){		
	return this.m_filter.getFilterById(id);
}
GridFilter.prototype.unsetFilterControlById = function(id){
	this.m_filter.unsetFilterById(id);
}

GridFilter.prototype.getParams = function(struc){		
	//debugger;
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
		
		//treat errors
		this.m_filter.m_params[ctrl_id].descr = this.m_elements[ctrl_id].getValue();
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
	if (grid.m_controller && grid.m_pagination){		
		grid.m_pagination.setFrom(0);
	}
}
GridFilter.prototype.addCommandControl = function(control){
	this.m_commandControls[control.getId()] = control;
}

GridFilter.prototype.refresh = function(){
	var grid = this.m_clickContext;
	if (grid){
		this.unsetGridFromParam(grid);
		this.m_onRefresh.call(grid);
	}
}

GridFilter.prototype.resetValues = function(){
	var params = this.m_filter.m_params;
	var id = this.getId();
	for (var ctrl_id in params){
		this.m_elements[ctrl_id].resetValue();
		TEMPLATE_PARAMS[id][ctrl_id] = undefined;//this.m_elements[ctrl_id].serialize()
	}
	this.refresh();
}
