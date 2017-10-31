/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires common/functions.js
*/

/* constructor */
function GridDbMasterDetail(id,options){
	options = options || {};
	GridDbMasterDetail.superclass.constructor.call(this,
		id,options);	
	this.m_detailListView = options.detailListView;
	this.m_detailReadModelId = options.detailReadModelId;
	this.m_detailController = options.detailController;
	this.m_details = {};
	this.m_masterIdCols = options.masterIdCols;
	this.m_detailExpandedCount = 0;
}
extend(GridDbMasterDetail,GridDb);

GridDbMasterDetail.prototype.m_details;
GridDbMasterDetail.prototype.m_detailKeys;
GridDbMasterDetail.prototype.m_detailExpandedCount;

GridDbMasterDetail.prototype.IMG_COLLAPSED = "img/treeview/plus.gif";
GridDbMasterDetail.prototype.IMG_EXPANDED = "img/treeview/minus.gif";

GridDbMasterDetail.prototype.onRefresh = function(){
	var self = this;
	var contr = this.getController();
	var meth = this.getReadMethodId();
	var pm;
	
	this.deleteAllDetails();
	
	//pagination
	var pag = this.getPagination();
	if (pag){
		pm = contr.getPublicMethodById(meth);
		pm.setParamValue(contr.PARAM_FROM,pag.getFrom());
		pm.setParamValue(contr.PARAM_COUNT,pag.getCountPerPage());
	}
	
	//filter
	var filter = this.getFilter();	
	if (filter){
		if (!pm){
			pm = contr.getPublicMethodById(meth);
		}
		var struc = {"fields":null,"signs":null,"vals":null,"icase":null};
		filter.getParams(struc);
		//if (struc.fields){
			pm.setParamValue(contr.PARAM_COND_FIELDS,struc.fields);
			pm.setParamValue(contr.PARAM_COND_SGNS,struc.signs);
			pm.setParamValue(contr.PARAM_COND_VALS,struc.vals);
			pm.setParamValue(contr.PARAM_COND_ICASE,struc.icase);
		//}
	}
	//ordering
	for (var col in this.m_sortCols){
		var sort = this.m_sortCols[col].getAttr("sort");
		if (sort=="asc"||sort=="desc"){
			pm.setParamValue(contr.PARAM_ORD_FIELDS,this.m_sortCols[col].getAttr("field_id"));
			pm.setParamValue(contr.PARAM_ORD_DIRECTS,sort);
		}
	}
	
	this.m_lastWriteResult = true;
	this.m_errorControl.setValue("");
	contr.runPublicMethod(meth,{},true,
		this.onGetData,this,this.onError);	
}

GridDbMasterDetail.prototype.onDetails = function(rowId,keys){
	var key_str="";
	for (var id in keys){
		key_str+=(key_str=="")? "":"_";
		key_str+=keys[id];
	}
	var row_node = nd(rowId);
	if (this.m_details[key_str]==undefined){
		this.addDetail(row_node,keys,key_str);
	}
	else{
		this.deleteDetail(this.m_details[key_str]);
		delete this.m_details[key_str];
		if (isEmpty(this.m_details)){			
			this.setRefreshInterval(this.m_refreshIntervalCopy);
		}
	}
}
GridDbMasterDetail.prototype.addDetail = function(rowNode,keyAr,keyStr){
	this.m_refreshIntervalCopy = this.getRefreshInterval();
	this.setRefreshInterval(0);
	this.m_details[keyStr] = {};
	//this.m_details[keyStr].rowNode = rowNode;
	var connect = this.m_controller.getServConnector();
	this.m_details[keyStr].viewObj = 
		new this.m_detailListView(
			rowNode.id+"_detail",
			{"readController":new this.m_detailController(connect),
			"readModelId":this.m_detailReadModelId,
			"connect":connect,
			"masterKeys":keyAr
			}	
	);	
	this.m_details[keyStr].keyAr = keyAr;
	this.m_details[keyStr].rowNode = document.createElement("tr");
	this.m_details[keyStr].rowNode.setAttribute("class","grid_details");
	this.m_details[keyStr].viewObj.toDOM(this.m_details[keyStr].rowNode);
	rowNode.parentNode.insertBefore(this.m_details[keyStr].rowNode,rowNode.nextSibling)
	var td = rowNode.getElementsByTagName("td");
	if (td){
		var img = td[0].getElementsByTagName("img");
		if (img){
			img[0].src = this.IMG_EXPANDED;
		}
	}
	this.m_detailExpandedCount++;
}
GridDbMasterDetail.prototype.deleteDetail = function(detail){
	detail.viewObj.removeDOM();
	delete detail.viewObj;
	var row_node = detail.rowNode;
	if (row_node.previousSibling){
		var td = row_node.previousSibling.getElementsByTagName("td");
		if (td){
			var img = td[0].getElementsByTagName("img");
			if (img){
				img[0].src=this.IMG_COLLAPSED;	
			}
		}
		row_node.parentNode.removeChild(row_node);	
		this.m_detailExpandedCount--;
	}
}
GridDbMasterDetail.prototype.deleteAllDetails = function(){
	this.m_detailKeys = {};
	for (var id in this.m_details){
		this.m_detailKeys[id] = this.m_details[id].keyAr;
		this.deleteDetail(this.m_details[id]);
	}
	this.m_details = {};
	this.m_detailExpandedCount = 0;
}
GridDbMasterDetail.prototype.restoreAllDetails = function(){
	if (this.m_detailKeys==undefined){
		return;
	}
	
	var id_ar;
	for (var id in this.m_detailKeys){
		id_ar =this.m_detailKeys[id];
		//iterate through all rows
		var rows = this.m_node.childNodes[1].childNodes;
		var found=false;
		for (var row_ind=0;row_ind<rows.length;row_ind++){
			for (id_ar_id in id_ar){
				var col_num = this.m_masterIdCols[id_ar_id];
				if (rows[row_ind].childNodes[col_num].childNodes[0].nodeValue==id_ar[id_ar_id]){
					this.addDetail(rows[row_ind],id_ar,id);
					//alert(id_ar_id);
					found=true;
					break;
				}
			}
			if (found){
				break;
			}
		}
		
	}
	delete this.m_detailKeys;
}

GridDbMasterDetail.prototype.onGetData = function(resp){
	var model = resp.getModelById(this.getReadModelId());
	model.setActive(true);
	var head_cells = {};
	this.getHead().getFields(head_cells);
	var body = this.getBody();
	body.removeDOM();
	body.clear();
	var bind,keys,field_count,row_count=0;		
	
	//
	var pag = this.getPagination();
	if (pag){
		pag.setCountTotal(model.getTotCount());
	}
	
	if (this.m_onSelect){
		this.m_selects = {};
		var set_select = function(grid,node,keys,descrs){
			EventHandler.addEvent(node,"dblclick",
			function(){
				grid.m_onSelect.call(null,keys,descrs);
			}
			,true);				
		}				
	}
	var row;
	var row_tot_count=model.getRowCount();
	while (model.getNextRow()){
		var row_id = this.getId()+"_row_"+row_count;
		var row_class = "";
		if (row_count%2==0){
			row_class = "even";
		}
		else{
			row_class = "odd";
		}
		if (this.m_onSelect){
			row_class+=" for_select";
		}
		row = new GridRow(row_id,{"className":row_class});
		var keyValues={};
		var descrValues={};
		field_count = 0;
		
		var detail_td;
		if (row_tot_count==(row_count+1)
		&&this.m_lastRowFooter){
			detail_td=new Control(null,"td");
		}
		else{
			detail_td=new DetailRowCommand(null,
					{"onClick":this.onDetails,
					"rowId":row_id,
					"keys":keyValues,
					"clickContext":this,
					"imageCollapsed":this.IMG_COLLAPSED,
					attrs:{"class":"grid_sys_col"}}
			);
		}
		row.setElementById("details",detail_td);
		
		for (var head_id in head_cells){
			bind = head_cells[head_id].getReadBind();
			if (!bind)continue;
			keys = bind.keyFieldIds;
			attrs = null;
			if (head_cells[head_id].getKeyCol()){
				keyValues[bind.valueFieldId] = model.getFieldById(bind.valueFieldId).getValue();
			}
			if (head_cells[head_id].getDescrCol()){
				descrValues[bind.valueFieldId] = model.getFieldById(bind.valueFieldId).getValue();
			}

			attrs = {};
			if (keys){					
				for (var key_ind=0;key_ind<keys.length;key_ind++){
					attrs["fkey_"+keys[key_ind]] =
						model.getFieldById(keys[key_ind]).getValue();
				}				
			}
			var common_attrs = head_cells[head_id].getColAttrs();
			if (common_attrs){
				for (common_attr_id in common_attrs){
					attrs[common_attr_id]=common_attrs[common_attr_id];
				}
			}
			
			row.setElementById("field"+field_count,
				new GridCell(null,
				{"value":model.getFieldById(bind.valueFieldId).getValue(),
				"attrs":attrs,
				"accocImageArray":head_cells[head_id].getAssocImageArray()
				}
				));
				
			field_count++;
		}
		row.setAttr("key_values",array2json(keyValues));
		
		//system row
		var row_cmd_class = this.getRowCommandPanelClass();
		if (row_cmd_class){
			row.setElementById("sys",new row_cmd_class(null,
				{"onClickEdit":this.onEdit,
				"onClickDelete":this.onDelete,
				"rowId":row_id,
				"keys":keyValues,
				"clickContext":this}
			));
		}
		body.setElementById(row_count,row);
		row_count++;
		
		if (this.m_onSelect){
			this.m_selects[row_id] =
				new set_select(this,row.m_node,keyValues,descrValues);
		}
		
	}
	if (this.m_lastRowFooter&&row){
		DOMHandler.addClass(row.m_node,"grid_foot");
	}	
	body.toDOM(this.m_node);
	this.restoreAllDetails();
	
	if (this.m_onEventRefresh){
		this.m_onEventRefresh.call(this.m_eventContext,resp);
	}
	if (this.m_navigate){
		this.setSelection();
	}
	
	//GridDbMasterDetail.superclass.onRefresh.call(this,resp);	
}
GridDbMasterDetail.prototype.getDetailExpandedCount = function(){
	return this.m_detailExpandedCount;
}

/* constructor */
function DetailRowCommand(id,options){
	options = options || {};
	var tagName = options.tagName || this.DEF_TAG_NAME;
	DetailRowCommand.superclass.constructor.call(this,
		id,tagName,options);
	
	var self = this;
	
	if (options.onClick){
		this.setElementById("edit",new Button(null,
		{"image":{"src":options.imageCollapsed},
		"onClick":function(){
			options.onClick.call(options.clickContext,options.rowId,options.keys);
			}
		})
		);
	}
}
extend(DetailRowCommand,ControlContainer);

DetailRowCommand.prototype.DEF_TAG_NAME = "td";