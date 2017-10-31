/* Copyright (c) 2016 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
/** Requirements
 * @requires 
 * @requires core/extend.js  
*/

/* constructor
@param string id
@param object options{

}
*/
function ViewGridColumnManager(id,options){
	options = options || {};	
				
	ViewGridColumnManager.superclass.constructor.call(this,id,"div",options);
	
	this.m_onClose = options.onClose;
	this.m_grid = options.grid;
	this.m_template = this.m_grid.getAttr("name");
	
	var visib_val;
	if (TEMPLATE_PARAMS[this.m_template] && TEMPLATE_PARAMS[this.m_template].visibility){
		visib_val = TEMPLATE_PARAMS[this.m_template].visibility;
	}
	else{
		//видимость по умолчанию
		visib_val = [];
		var head_cells={};
		this.m_grid.getHead().getFields(head_cells);
		
		for (var head_id in head_cells){
			var descr = head_cells[head_id].getValue();
			if (descr){
				/*
				var f_id = head_cells[head_id].getAttr("name");				
				if (!f_id){
					var bind = head_cells[head_id].getReadBind();
					if (bind)f_id = bind.valueFieldId;
				}
				
				if (!f_id){
					continue;
				}
				*/
				var bind = head_cells[head_id].getReadBind();
				if (!bind)continue;
				
				visib_val.push({
					"id":bind.valueFieldId,
					"descr":descr,
					"checked":true
					});
			}
		}
	}

	var order_val;
	if (TEMPLATE_PARAMS[this.m_template] && TEMPLATE_PARAMS[this.m_template].order){
		order_val = TEMPLATE_PARAMS[this.m_template].order;
	}
	else{
		//сортировка по умолчанию
		order_val = [];
		var head_cells={};
		this.m_grid.getHead().getFields(head_cells);
		
		for (var head_id in head_cells){
			var descr = head_cells[head_id].getValue();
			if (descr && head_cells[head_id].getSortable()){
				var bind = head_cells[head_id].getReadBind();
				if (!bind)continue;
			
				var direct = head_cells[head_id].getAttr("sort");
				if (!direct || direct=="")direct="undefined";
			
				order_val.push({
					"id":bind.valueFieldId,
					"descr":descr,
					"checked":(direct!="undefined"),
					"direct":direct
					});
			}
		}
		
	}
	
	var self = this;
	
	this.m_menu = new ViewMenu(uuid());
	
	this.m_menu.addItem({
		"caption":"Видимость",
		"viewClassId":ViewGridColVisibility,
		"id":"ViewGridColVisibility",
		"viewParams":{
			"paramValue":visib_val,
			"template":this.m_template,
			"onAfterSave":function(struc){
				self.onAfterVisibilitySave(struc);
			}
		}
	});

	this.m_menu.addItem({
		"caption":"Сортировка",
		"viewClassId":ViewGridColOrder,
		"id":"ViewGridColOrder",
		"viewParams":{
			"paramValue":order_val,
			"template":this.m_template,
			"onAfterSave":function(struc){
				self.onAfterOrderSave(struc);
			}
		}
	});
	
	this.addElement(this.m_menu);
	
	this.addElement(new ButtonCmd(uuid(),{
		"caption":"Закрыть",
		"attrs":{"title":"Закрыть форму"},
		"onClick":function(){
			self.m_onClose.call(self);
		}
	}));
	
}
extend(ViewGridColumnManager,ControlContainer);//

/* Constants */


/* private members */

/* protected*/


/* public methods */

ViewGridColumnManager.prototype.toDOM = function(parent){
	ViewGridColumnManager.superclass.toDOM.call(this,parent);
	
	var item = this.m_menu.m_menu.getElement("ViewGridColVisibility_menu");
	item.setActive();
	item.m_onClick.call(item.m_onClickContext,item.m_viewClassId);
}

ViewGridColumnManager.prototype.getColNames = function(){
	var col_names = {};
	var head = this.m_grid.getHead();
	
	for (var row in head.m_elements){
		var head_row=head.m_elements[row];
		for (var col in head_row.m_elements){
			if (head_row.m_elements[col].getSortable()){
				var f_name = head_row.m_elements[col].getName();
				if (f_name){
					col_names[f_name] = head_row.m_elements[col];
				}
			}
		}
	}
	
	return col_names;
}

ViewGridColumnManager.prototype.onAfterVisibilitySave = function(struc){
	var ref_interval = this.m_grid.getRefreshInterval();
	this.m_grid.setRefreshInterval(0);
	
	try{
		if (!TEMPLATE_PARAMS[this.m_template]) TEMPLATE_PARAMS[this.m_template] = {};
		TEMPLATE_PARAMS[this.m_template].visibility = struc;
		var head = this.m_grid.getHead();
		for (var row in head.m_elements){
			var head_row=head.m_elements[row];

			head_row.removeDOM();		
			head_row.setColumnOrder(struc);
		}
	
		//head.removeDOM();
		head.toDOM(this.m_grid.m_node);
		this.m_grid.onRefresh();
	}
	catch(e){
		this.m_grid.getErrorControl().setValue(e.message);
		this.m_grid.setRefreshInterval(ref_interval);
	}
}

ViewGridColumnManager.prototype.onAfterOrderSave = function(struc){
	if (!TEMPLATE_PARAMS[this.m_template]) TEMPLATE_PARAMS[this.m_template] = {};
	
	TEMPLATE_PARAMS[this.m_template].order = struc;
	
	var col_names = this.getColNames();
	
	this.m_grid.m_sortCols={};
	
	for (var id in struc){
		var f_name = struc[id].id; 
		this.m_grid.m_sortCols[col_names[f_name].getId()] = col_names[f_name];
		
		if (struc[id].checked && struc[id].direct!="undefined" && col_names[f_name]){						
			col_names[f_name].setSort(struc[id].direct);
		}
		else{
			col_names[f_name].unsetSort();
		}
	}
		
	this.m_grid.onRefresh();
}
