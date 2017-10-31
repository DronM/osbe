/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc object dialog view
 
 * @extends GridCmd
 
 * @requires core/extend.js
 * @requires controls/GridCmd.js
 * @requires controls/ViewGridColManager.js               
 
 * @param string id 
 * @param {namespace} options
 * @param {namespace} options.filters
 * @param {GridCmd} options.controlSave
 * @param {GridCmd} options.controlOpen
 * @param {namespace} options.filters   
 */
function GridCmdColManager(id,options){
	options = options || {};	

	options.glyph = "glyphicon-th-list";
	options.showCmdControl = false;
	
	this.m_variantStorageName = options.variantStorageName;
	
	//this.m_filter = new ModelFilter({"filters":v})
	
	GridCmdColManager.superclass.constructor.call(this,id,options);

	if (options.variantStorageModel && options.variantStorageModel.getRow(0)){
		//!!!ИСПРАВЛЕНО!!!
		var s = "";//options.variantStorageModel.getFieldValue(this.VISIB_ID);
		this.m_colVisibility = (s.length)? CommonHelper.unserialize(s):[];
		
		//!!!ИСПРАВЛЕНО!!!
		s = "";//options.variantStorageModel.getFieldValue(this.VISIB_ID);
		this.m_colOrder = (s.length)? CommonHelper.unserialize(s):[];
		/*
		var set_cnt = this.m_filter.unserialize(options.variantStorageModel.getFieldValue("filter_data"));
		this.afterFilterSet(set_cnt);
		if (set_cnt){
		//	this.m_filter.applyFilters(this.m_grid);
		}
		*/
	}
	else{
		this.m_colVisibility = [];
		this.m_colOrder = [];
	}			
}
extend(GridCmdColManager,GridCmd);


GridCmdColManager.prototype.m_colManForm;

GridCmdColManager.prototype.m_variantStorageName;

/* Constants */
GridCmdColManager.prototype.VISIB_ID = "col_visib_data";
GridCmdColManager.prototype.ORDER_ID = "col_order_data";
GridCmdColManager.prototype.FILTER_ID = "filter_data";


/* private members */
GridCmdColManager.prototype.onCommand = function(){
	var self = this;
	this.m_view = new ViewGridColManager("ViewGridColManager",{
		"grid":this.m_grid,
		"variantStorageName":this.m_variantStorageName,
		"filter":this.m_filter,
		"onApplyFilters":function(){
			self.onApplyFilters();
		},
		"onResetFilters":function(){
			self.onResetFilters();
		},
		"onVariantSave":function(){
			self.onVariantSave();
		},
		"onVariantOpen":function(){
			self.onVariantOpen();
		},
		
		"colOrder":this.m_colOrder,
		"colVisibility":this.m_colVisibility
	});
	this.m_colManForm = new WindowFormModalBS(CommonHelper.uniqid(),{
		"content":this.m_view,
		"cmdCancel":true,
		"controlCancelCaption":this.m_view.CMD_CANCEL_CAP,
		"controlCancelTitle":this.m_view.CMD_CANCEL_TITLE,
		"cmdOk":false,
		"onClickCancel":function(){
			self.m_colManForm.close();
			self.refreshGrid();
		},				
		
		"contentHead":this.m_view.HEAD_TITLE
	});

	this.m_colManForm.open();
}

/* protected*/
GridCmdColManager.prototype.m_filter;

GridCmdColManager.prototype.BTN_FILTER_CLASS_SET = "btn-danger";
GridCmdColManager.prototype.BTN_FILTER_CLASS_UNSET = "btn-primary";


/* public methods */
GridCmdColManager.prototype.getColOrder = function(){
	return this.m_colOrder;
}
GridCmdColManager.prototype.getColVisibility = function(){
	return this.m_colVisibility;
}

GridCmdColManager.prototype.init = function(){
	var head = this.m_grid.getHead();
	for (var row in head.m_elements){
		var head_row = head.m_elements[row];
		var columns = head_row.getInitColumns();
		
		//add descr
		var vis_cols = {};
		for (var ind=0;ind<this.m_colVisibility.length;ind++){
			var col = this.m_colVisibility[ind].colId;
			//this.m_colVisibility[ind].descr = columns[col].getValue();
			this.m_colVisibility[ind].colRef = columns[col];
			vis_cols[col] = col;
		}

		//add order
		var ord_cols = {};
		for (var ind=0;ind<this.m_colOrder.length;ind++){
			var col = this.m_colOrder[ind].colId;
			this.m_colOrder[ind][ind].colRef = columns[col];
			ord_cols[col] = col;
		}
		
		for (var col in columns){		
			//visibility
			if (!vis_cols[col]){
				this.m_colVisibility.push({
					"colId":col,
					"checked":true,
					"colRef":columns[col]
				});
			}
			
			//order
			if (!ord_cols[col] && columns[col].getSortable()){
				var sort_cols = columns[col].getSortFieldId();
				var sort_dir = columns[col].getSort();
				
				if (!sort_cols){				
					sort_dir = "";
					sort_cols = "";
					var cols = columns[col].getColumns();
					for(var i=0;i<cols.length;i++){
						sort_cols+= (sort_cols=="")? "":",";//ToDo SEPARATOR!!!
						sort_cols+= cols[i].getField().getId();
						sort_dir+=  (sort_dir=="")? "":",";
						sort_dir+= "asc";
					}
				}
			
				this.m_colOrder.push({
					"colId":col,
					"fields":sort_cols,
					"directs":sort_dir,
					"checked":(sort_dir.length>0),
					"colRef":columns[col]
				});
			}
			
		}
	}
}

GridCmdColManager.prototype.getFilter = function(){
	return this.m_filter;
}

GridCmdColManager.prototype.setFilter = function(v){
	this.m_filter = v;
}

GridCmdColManager.prototype.afterFilterSet = function(setCnt){
	var cl_old,cl_new;
	if (setCnt){
		cl_new = this.BTN_FILTER_CLASS_SET;
		cl_old = this.BTN_FILTER_CLASS_UNSET;
	}
	else{
		cl_new = this.BTN_FILTER_CLASS_UNSET;
		cl_old = this.BTN_FILTER_CLASS_SET;		
	}
	//ToDo get Control!!!
	//DOMHelper.swapClasses(this.m_controls[0].getNode(),cl_new,cl_old);
}

GridCmdColManager.prototype.refreshGrid = function(){
	var pag = this.m_grid.getPagination();
	if (pag){
		pag.reset();
	}						
	var self = this;
	this.m_grid.onRefresh();
}

GridCmdColManager.prototype.onApplyFilters = function(){
	var cnt = this.m_filter.applyFilters(this.m_grid);
	this.afterFilterSet(cnt);
	this.refreshGrid();
}
GridCmdColManager.prototype.onResetFilters = function(){						
	this.m_filter.resetFilters(this.m_grid);
	this.afterFilterSet(0);
	this.refreshGrid();
}
GridCmdColManager.prototype.onVariantSave = function(){
	alert("GridCmdColManager.prototype.onVariantSave")
}
GridCmdColManager.prototype.onVariantOpen = function(){
	alert("GridCmdColManager.prototype.onVariantOpen")
}
