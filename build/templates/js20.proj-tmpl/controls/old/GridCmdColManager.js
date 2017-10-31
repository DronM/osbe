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
function GridCmdColManager(id,options){
	options = options || {};	

	options.glyph = "glyphicon-th-list";
	options.showCmdControl = false;
	
	this.m_colOrderParamId = options.colOrderParamId || this.DEF_ORDER_PARAM_ID;
	this.m_colVisibilityParamId = options.colVisibilityParamId || this.DEF_VISIBILITY_PARAM_ID;
	this.m_colFilterParamId = options.colFilterParamId || this.DEF_FILTER_PARAM_ID;
	
	this.m_colTemplate = options.colTemplate;
	
	GridCmdColManager.superclass.constructor.call(this,id,options);
			
}
extend(GridCmdColManager,GridCmd);


GridCmdColManager.prototype.colManform;

GridCmdColManager.prototype.m_colTemplate;
GridCmdColManager.prototype.m_colOrderParamId;
GridCmdColManager.prototype.m_colVisibilityParamId;
GridCmdColManager.prototype.m_colFilterParamId;

/* Constants */
GridCmdColManager.prototype.DEF_VISIBILITY_PARAM_ID = "gridColVisibility";
GridCmdColManager.prototype.DEF_FILTER_PARAM_ID = "gridColFilter";
GridCmdColManager.prototype.DEF_ORDER_PARAM_ID = "gridColOrder";


/* private members */
GridCmdColManager.prototype.onCommand = function(){
	var btnCont = this;
	var self = this;
	this.m_colManform = new WindowFormModalBS(CommonHelper.uniqid(),{
		"content":new ViewGridColManager("ViewGridColManager",{
			"grid":this.m_grid,
			"colTemplate":this.m_colTemplate,
			"colOrderParamId":this.m_colOrderParamId,
			"colVisibilityParamId":this.m_colVisibilityParamId,
			"colFilterParamId":this.m_colFilterParamId,
			"onClose":function(){
				btnCont.m_colManform.close();
				self.m_grid.onRefresh.call(self.m_grid);
			},
			"app":this.getApp()
		})
	});

	this.m_colManform.open();
}

/* protected*/


/* public methods */
GridCmdColManager.prototype.getColOrder = function(){
	return this.getApp().getTemplateParam(this.m_colTemplate,this.m_colOrderParamId);
}
GridCmdColManager.prototype.getColVisibility = function(){
	return this.getApp().getTemplateParam(this.m_colTemplate,this.m_colVisibilityParamId);
}
GridCmdColManager.prototype.getColFilter = function(){
	return this.getApp().getTemplateParam(this.m_colTemplate,this.m_colFilterParamId);
}

GridCmdColManager.prototype.saveTemplate = function(templateId,paramId,paramVal,callBackOk){
	var self = this;
	var contr = new TemplateParam_Controller(this.getApp());
	var pm = contr.getPublicMethod("set_value");
	pm.setFieldValue("template",templateId);
	pm.setFieldValue("param",paramId);
	pm.setFieldValue("val",paramVal);		
	pm.run({
		"ok":function(resp){
			callBackOk.call(this);
			window.showNote(self.NOTE_SAVED);
		}
	});

}

GridCmdColManager.prototype.init = function(){

	var t_params = this.getApp().getTemplateParams(this.m_colTemplate);
	t_params[this.m_colVisibilityParamId] = t_params[this.m_colVisibilityParamId] || [];
	t_params[this.m_colOrderParamId] = t_params[this.m_colOrderParamId] || [];
	t_params[this.m_colFilterParamId] = t_params[this.m_colFilterParamId] || [];
	
	var head = this.m_grid.getHead();
	for (var row in head.m_elements){
		var head_row = head.m_elements[row];
		var columns = head_row.getInitColumns();
		
		//add descr
		var vis_cols = {};
		for (var ind=0;ind<t_params[this.m_colVisibilityParamId].length;ind++){
			var col = t_params[this.m_colVisibilityParamId][ind].colId;
			//t_params[this.m_colVisibilityParamId][ind].descr = columns[col].getValue();
			t_params[this.m_colVisibilityParamId][ind].colRef = columns[col];
			vis_cols[col] = col;
		}

		//add order
		var ord_cols = {};
		for (var ind=0;ind<t_params[this.m_colOrderParamId].length;ind++){
			var col = t_params[this.m_colOrderParamId][ind].colId;
			t_params[this.m_colOrderParamId][ind].colRef = columns[col];
			ord_cols[col] = col;
		}
		
		for (var col in columns){		
			//visibility
			if (!vis_cols[col]){
				t_params[this.m_colVisibilityParamId].push({
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
			
				t_params[this.m_colOrderParamId].push({
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

