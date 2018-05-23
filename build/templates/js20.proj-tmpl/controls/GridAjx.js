/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>,2016

 * @class
 * @classdesc grid object
  
 * @requires controls/WindowQuestion.js
 * @requires controls/GridHead.js
 * @requires controls/GridBody.js
 * @requires controls/GridFoot.js
 * @requires controls/GridPagination.js     

 * @param {string} id Object identifier
 * @param {namespace} options
 * @param {PublicMethod} [options.readPublicMethod=get_list]
 * @param {PublicMethod} [options.insertPublicMethod=insert]
 * @param {PublicMethod} [options.updatePublicMethod=update]
 * @param {PublicMethod} [options.deletePublicMethod=delete]
 * @param {PublicMethod} options.exportPublicMethod
 * @param {PublicMethod} [options.editPublicMethod=get_object]
 * @param {ControllerDb} options.controller
 * @param {bool} [options.refreshAfterDelRow=false]
 * @param {Array} options.filters array of Filter objects
*/
function GridAjx(id,options){
	options = options || {};	
	
	if (options.editInline){
		//default vlass for editInline=true
		options.editViewClass = options.editViewClass || ViewGridEditInlineAjx;
	}
	
	this.m_filters = {};
	
	if (options.controller){
		options.readPublicMethod = options.readPublicMethod
			|| ( (options.controller.publicMethodExists(options.controller.METH_GET_LIST))?
				options.controller.getPublicMethod(options.controller.METH_GET_LIST):null );
				
		options.insertPublicMethod = options.insertPublicMethod
			|| ( (options.controller.publicMethodExists(options.controller.METH_INSERT))?
				options.controller.getPublicMethod(options.controller.METH_INSERT):null );

		options.updatePublicMethod = options.updatePublicMethod
			|| ( (options.controller.publicMethodExists(options.controller.METH_UPDATE))?
				options.controller.getPublicMethod(options.controller.METH_UPDATE):null );

		options.deletePublicMethod = options.deletePublicMethod
			|| ( (options.controller.publicMethodExists(options.controller.METH_DELETE))?
				options.controller.getPublicMethod(options.controller.METH_DELETE):null );

		options.editPublicMethod = options.editPublicMethod
			|| ( (options.controller.publicMethodExists(options.controller.METH_GET_OBJ))?
				options.controller.getPublicMethod(options.controller.METH_GET_OBJ):null );
	}
	
	//Controller list model to dataSet model
	if (options.readPublicMethod && !options.model && options.readPublicMethod.getListModelClass()){
		var m_class = options.readPublicMethod.getListModelClass();
		options.model = new m_class();
	}
	
	this.setReadPublicMethod(options.readPublicMethod);
	this.setInsertPublicMethod(options.insertPublicMethod);
	this.setUpdatePublicMethod(options.updatePublicMethod);
	this.setDeletePublicMethod(options.deletePublicMethod);
	this.setExportPublicMethod(options.exportPublicMethod);
	this.setEditPublicMethod(options.editPublicMethod);				
	
	this.setRefreshAfterDelRow(options.refreshAfterDelRow);
		
	if (options.filters && options.filters.length){
		for (var i=0;i<options.filters.length;i++){
			this.setFilter(options.filters[i]);
		}
	}
	/*
	if (options.commands && options.controller && options.commands.getCmdPrintObj()){
		options.commands.getCmdPrintObj().setPrintObjList(options.controller.getPrintList());
	}
	*/
	
	GridAjx.superclass.constructor.call(this,id,options);
}
extend(GridAjx,Grid);

/* Constants */

/* private members */
GridAjx.prototype.m_readPublicMethod;
GridAjx.prototype.m_insertPublicMethod;
GridAjx.prototype.m_updatePublicMethod;
GridAjx.prototype.m_deletePublicMethod;
GridAjx.prototype.m_exportPublicMethod;
GridAjx.prototype.m_editPublicMethod;
GridAjx.prototype.m_refreshAfterDelRow;
GridAjx.prototype.m_filters;

/* protected*/
GridAjx.prototype.onGetData = function(resp){

	if(resp){
		this.m_model.setData(resp.getModelData(this.m_model.getId()));
	}
	
	GridAjx.superclass.onGetData.call(this);	
}

GridAjx.prototype.initEditView = function(parent,replacedNode,cmd){

	GridAjx.superclass.initEditView.call(this,parent,replacedNode,cmd);
	var pm;
	if (cmd=="insert"){
		pm = this.getInsertPublicMethod();
		/*
		var contr = pm.getController();
		if (pm.fieldExists(contr.PARAM_RET_ID)){
			pm.setFieldValue(contr.PARAM_RET_ID,1);
		}
		*/
	}
	else{
		pm = this.getUpdatePublicMethod();
	}
	this.m_editViewObj.setWritePublicMethod(pm);
	this.m_editViewObj.setReadPublicMethod(this.getEditPublicMethod());
}

GridAjx.prototype.fillEditView = function(cmd){
	if (cmd!="insert"){
		this.keysToPublicMethod(this.m_editViewObj.getReadPublicMethod());
	}
	
	GridAjx.superclass.fillEditView.call(this,cmd);
}

GridAjx.prototype.keysToPublicMethod = function(pm){
	var pm_fields = pm.getFields();
	var fields = this.m_model.getFields();
	for (id in pm_fields){
		if (fields[id] && fields[id].getPrimaryKey()){
			pm_fields[id].setValue(fields[id].getValue());
		}
	}
}

/*reads data to editViewObj*/
GridAjx.prototype.read = function(cmd){
	if (this.m_editViewObj){
		this.m_editViewObj.read(cmd,function(resp,erCode,erStr){
			self.onError(resp,erCode,erStr)
		});
	}
}

/*
GridAjx.prototype.edit = function(cmd){
	GridAjx.superclass.edit.call(this,cmd);

	if (this.m_editViewObj){
		var pm = this.m_editViewObj.getReadPublicMethod();
		if (!pm){
			throw Error(this.ER_NO_EDIT_PM);
		}
		
		this.keysToPublicMethod(pm);
	}
}
*/

/* Completely overridden function */
GridAjx.prototype.delRow = function(rowNode){
	var pm = this.getDeletePublicMethod();
	if (!pm){
		throw Error(this.ER_NO_DEL_PM);
	}
	
	this.setEnabled(false);
	
	this.setModelToCurrentRow(rowNode);	
	this.keysToPublicMethod(pm);
	var self = this;
	pm.run({
		"async":false,
		"ok":function(){
			/*
			self.deleteRowNode();
			self.setEnabled(true);			
			
			window.showNote(self.NT_REC_DELETED,function(){
				self.focus();
				if (self.getRefreshAfterDelRow()){
					self.onRefresh();
				}
				
			},2000);			
			*/
			self.afterServerDelRow();
		},
		"fail":function(resp,erCode,erStr){
			self.setEnabled(true);
			self.onError(resp,erCode,erStr);
		}
	});	
}

GridAjx.prototype.afterServerDelRow = function(){
	this.deleteRowNode();
	this.setEnabled(true);			
	var self = this;
	window.showNote(this.NT_REC_DELETED,function(){
		self.focus();
		if (self.getRefreshAfterDelRow()){
			self.onRefresh();
		}		
	},2000);			
}

/*
GridAjx.prototype.afterDelRow = function(newNode){
	
	//set position to the next row on success
	if (this.m_rowSelect){
		this.selectRow(newNode);
	}
	else{
		this.selectCell(newNode);
	}

	this.setEnabled(true);
	this.focus();	

	if (this.getRefreshAfterDelRow()){
		this.onRefresh();
	}

}
*/

/* public methods */

GridAjx.prototype.filtersToMethod = function(sep){		
	var pm = this.getReadPublicMethod();	
	var contr = pm.getController();
	
	sep = (sep==undefined)? contr.PARAM_FIELD_SEP_VAL:sep;
	
	var s_fields,s_signs,s_vals,s_icases;
	for (var fid in this.m_filters){
		if (this.m_filters[fid] && this.m_filters[fid].field && this.m_filters[fid].sign){
			s_fields	= ( (!s_fields)? "":s_fields+sep) + this.m_filters[fid].field;
			s_signs		= ( (!s_signs)? "":s_signs+sep ) + this.m_filters[fid].sign;
			s_vals		= ( (!s_vals)? "":s_vals+sep ) + this.m_filters[fid].val;
			s_icases	= ( (!s_icases)? "":s_icases+sep ) + (this.m_filters[fid].icase || "0");
		}
	}
	
	pm.setFieldValue(contr.PARAM_COND_FIELDS, s_fields);
	pm.setFieldValue(contr.PARAM_COND_SGNS, s_signs);
	pm.setFieldValue(contr.PARAM_COND_VALS, s_vals);
	pm.setFieldValue(contr.PARAM_COND_ICASE, s_icases);
	
	/*
	if (this.m_commands && this.m_commands.getControlFilter && this.m_commands.getControlFilter()){		
		this.m_commands.getControlFilter().getFilter().applyFilters(this.getReadPublicMethod(),false);
	}
	else if (this.m_commands && this.m_commands.getCmdFilter && this.m_commands.getCmdFilter()){
		this.m_commands.getCmdFilter().applyFilters();
	}
	else{
		//clear
		var pm = this.getReadPublicMethod();	
		var contr = pm.getController();
		pm.getField(contr.PARAM_COND_FIELDS).unsetValue();
		pm.getField(contr.PARAM_COND_SGNS).unsetValue();
		pm.getField(contr.PARAM_COND_VALS).unsetValue();
		pm.getField(contr.PARAM_COND_ICASE).unsetValue();		
	}
	*/
}

/**
* @param {function} callBack - A callback function to be called when refreshing is done, after onGetData is called
*/
GridAjx.prototype.onRefresh = function(callBack){	
	
	var self = this;
	var pm = this.getReadPublicMethod();	
	if (!pm){
		throw Error(this.ER_NO_READ_PM);
	}
	
	var contr = pm.getController();
	
	//pagination
	var pag = this.getPagination();
	if (pag && !isNaN(pag.getFrom())){
		pm.setFieldValue(contr.PARAM_FROM,pag.getFrom());
		pm.setFieldValue(contr.PARAM_COUNT,pag.getCountPerPage());
	}
	else if (pag){
		pm.getField(contr.PARAM_FROM).unsetValue();
		pm.getField(contr.PARAM_COUNT).unsetValue();	
	}
	
	if (pm.fieldExists(contr.PARAM_COND_FIELDS)){
		//filter
		this.filtersToMethod(contr.PARAM_FIELD_SEP_VAL);
		//separator	
		pm.setFieldValue(contr.PARAM_FIELD_SEP, contr.PARAM_FIELD_SEP_VAL);
	}
			
	//ordering
	var sort_cols,sort_dirs;
	var head = this.getHead();
	if (head && pm.fieldExists(contr.PARAM_ORD_FIELDS) ){
		for (var row in head.m_elements){
			var head_row = head.m_elements[row];
			for (var col in head_row.m_elements){
				if (head_row.m_elements[col].getSortable()){
					var sort_dir = head_row.m_elements[col].getSort();
					if (sort_dir == "asc" || sort_dir == "desc"){
						var sort_col = head_row.m_elements[col].getSortFieldId();
						if (!sort_col){				
							var cols = head_row.m_elements[col].getColumns();
							for(var i=0;i<cols.length;i++){
								sort_cols = (sort_cols==undefined)? "":sort_cols;
								sort_cols+= (sort_cols=="")? "":contr.PARAM_FIELD_SEP_VAL;
								sort_cols+= cols[i].getField().getId();
								sort_dirs = (sort_dirs==undefined)? "":sort_dirs;
								sort_dirs+=  (sort_dirs=="")? "":contr.PARAM_FIELD_SEP_VAL;
								sort_dirs+= sort_dir;
							}
						}
						else{
							sort_cols = (sort_cols==undefined)? "":sort_cols;
							sort_cols+= (sort_cols=="")? "":contr.PARAM_FIELD_SEP_VAL;
							sort_cols+= sort_col;
							sort_dirs = (sort_dirs==undefined)? "":sort_dirs;
							sort_dirs+=  (sort_dirs=="")? "":contr.PARAM_FIELD_SEP_VAL;
							sort_dirs+= sort_dir;					
						}
					}
				}
			}		
		}
		pm.setFieldValue(contr.PARAM_ORD_FIELDS, sort_cols);
		pm.setFieldValue(contr.PARAM_ORD_DIRECTS, sort_dirs);				
	}	
	/*
	for (var col in this.m_sortCols){
		var sort_directs = this.m_sortCols[col].getSort();
		if (sort_directs == "asc" || sort_directs == "desc"){			
			var sort_cols = this.m_sortCols[col].getSortFieldId();
			if (!sort_cols){				
				var init_sort_direct = sort_directs;
				sort_directs = "";
				sort_cols = "";
				var cols = this.m_sortCols[col].getColumns();
				for(var i=0;i<cols.length;i++){
					sort_cols+= (sort_cols=="")? "":",";//ToDo SEPARATOR!!!
					sort_cols+= cols[i].getField().getId();
					sort_directs+=  (sort_directs=="")? "":",";
					sort_directs+= init_sort_direct;
				}
			}
			pm.setFieldValue(contr.PARAM_ORD_FIELDS, sort_cols);
			pm.setFieldValue(contr.PARAM_ORD_DIRECTS, sort_directs);
		}
	}
	*/
	//console.log("GridAjx.onRefresh before query")
	pm.run({
		"ok":function(resp){
			self.onGetData(resp);
			if (callBack){
				callBack.call(self);
			}
		},
		"fail":function(resp,erCode,erStr){
			self.onError(resp,erCode,erStr);
		}
	});
}

GridAjx.prototype.onError = function(resp,erCode,erStr){
	GridAjx.superclass.onError.call(this,window.getApp().formatError(erCode,erStr));
}

GridAjx.prototype.setReadPublicMethod = function(v){
	this.m_readPublicMethod = v;
}

GridAjx.prototype.getReadPublicMethod = function(){
	return this.m_readPublicMethod;
}

GridAjx.prototype.setInsertPublicMethod = function(v){
	this.m_insertPublicMethod = v;
}

GridAjx.prototype.getInsertPublicMethod = function(){
	return this.m_insertPublicMethod;
}

GridAjx.prototype.setUpdatePublicMethod = function(v){
	this.m_updatePublicMethod = v;
}

GridAjx.prototype.getUpdatePublicMethod = function(){
	return this.m_updatePublicMethod;
}

GridAjx.prototype.setDeletePublicMethod = function(v){
	this.m_deletePublicMethod = v;
}

GridAjx.prototype.getDeletePublicMethod = function(){
	return this.m_deletePublicMethod;
}

GridAjx.prototype.setExportPublicMethod = function(v){
	this.m_exportPublicMethod = v;
}

GridAjx.prototype.getExportPublicMethod = function(){
	return this.m_exportPublicMethod;
}

GridAjx.prototype.setEditPublicMethod = function(v){
	this.m_editPublicMethod = v;
}

GridAjx.prototype.getEditPublicMethod = function(){
	return this.m_editPublicMethod;
}

GridAjx.prototype.setRefreshAfterDelRow = function(v){
	this.m_refreshAfterDelRow = v;
}

GridAjx.prototype.getRefreshAfterDelRow = function(){
	return this.m_refreshAfterDelRow;
}
GridAjx.prototype.getFilters = function(){
	return this.m_filters;
}

GridAjx.prototype.getFilterKey = function(filterOrField,sign){
	var key;
	if (typeof(filterOrField)=="object"){
		key = filterOrField.field+filterOrField.sign;
	}
	else{
		key = filterOrField+sign;
	}
	//CommonHelper.md5(
	return key;
}

/*
filter struc{
	string field
	string sign
	string val
	int icase
}
*/
GridAjx.prototype.setFilter = function(filter){
	this.m_filters[this.getFilterKey(filter)] = filter;
}
GridAjx.prototype.getFilter = function(filterOrField,sign){
	return this.m_filters[this.getFilterKey(filterOrField,sign)];
}

GridAjx.prototype.unsetFilter = function(filterOrField,sign){
	this.m_filters[this.getFilterKey(filterOrField,sign)] = undefined;
}
