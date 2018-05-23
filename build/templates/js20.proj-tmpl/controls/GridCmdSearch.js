/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc button with calculator
 
 * @extends GridCmd

 * @requires core/extend.js
 * @requires controls/GridCmd.js     
  
 * @param {string} id - html tag id
 * @param {namespase} options
 */
function GridCmdSearch(id,options){
	options = options || {};	

	options.showCmdControl = true;
	
	var btn_class = options.buttonClass || ButtonCmd;
	
	var self = this;
	this.m_setCtrl = new btn_class(id+":set",{
			"glyph":"glyphicon-zoom-in",
			"onClick":function(){
					self.onCommand();
				},
			"attrs":{"title":this.TITLE}
		});
	this.m_unsetCtrl = new btn_class(id+":unset",{
			"glyph":"glyphicon-zoom-out",
			"onClick":function(){
					self.onUnset();
				},
			"enabled":false,
			"attrs":{"title":this.TITLE_UNSET}
		});

	
	options.controls = [this.m_setCtrl,this.m_unsetCtrl];
	
	GridCmdSearch.superclass.constructor.call(this,id,options);
		
}
extend(GridCmdSearch,GridCmd);

/* Constants */


/* private members */


GridCmdSearch.prototype.showDialog = function(str){
	//alert("GridCmdSearch.prototype.onCommand");
	var selected_node = this.m_grid.getSelectedNode();	
	
	if (!selected_node)return;
	
	var cur_field_id = selected_node.getAttribute("fieldId");
	
	var columns = [];
	
	var grid_columns = this.m_grid.getHead().getColumns();	
	for (var i in grid_columns){
		var f = grid_columns[i].getField();
		if (f && grid_columns[i].getSearchable()){
			//console.log("Type="+f.getDataType())
			var fid = f.getId();
			var col_sopts = grid_columns[i].getSearchOptions()||{};
			var sStruc = {
				"id":fid,
				"descr":grid_columns[i].getHeadCell().getValue(),
				"current":(cur_field_id==fid),
				"ctrlClass":grid_columns[i].getCtrlClass(),
				"ctrlOptions":grid_columns[i].getCtrlOptions() || {},
				"searchType": col_sopts.searchType || "on_part",
				"typeChange": col_sopts.typeChange,
				"field": col_sopts.field || f
			};
			if(sStruc.typeChange==undefined)sStruc.typeChange=true;			
			var data_t = f.getDataType();
			if (data_t==f.DT_DATE){
				if(!sStruc.ctrlClass)sStruc.ctrlClass = EditDate;
				if(!sStruc.searchType)sStruc.searchType = "on_match";
				sStruc.typeChange = false;
			}
			else if (data_t==f.DT_DATETIME||data_t==f.DT_DATETIMETZ){
				if(!sStruc.ctrlClass)sStruc.ctrlClass = EditDateTime;
				if(!sStruc.searchType)sStruc.searchType = "on_match";
				sStruc.typeChange = false;
			}
			else if (data_t==f.DT_INT||data_t==f.DT_INT_UNSIGNED){
				if(!sStruc.ctrlClass)sStruc.ctrlClass = EditInt;
			}
			else if (data_t==f.DT_FLOAT_UNSIGNED||data_t==f.DT_FLOAT){
				if(!sStruc.ctrlClass)sStruc.ctrlClass = EditFloat;
			}
			else if (data_t==f.DT_BOOL){
				if(!sStruc.ctrlClass)sStruc.ctrlClass = EditCheckBox;
				sStruc.searchType = "on_match";
				sStruc.typeChange = false;
			}
			else if (data_t==f.DT_EMAIL){
				if(!sStruc.ctrlClass)sStruc.ctrlClass = EditEmail;
			}
			
			else if(!sStruc.ctrlClass){
				sStruc.ctrlClass = EditString;
			}
			if(sStruc.searchType==undefined)sStruc.searchType="on_part";
			columns.push(sStruc);	
		}
	}
	
	/*
	var rows = this.m_grid.getHead().m_elements;
	for (var r_id in rows){
		for (var col_id in rows[r_id].m_elements){
			columns.push({
				"id":col_id,
				"descr":rows[r_id].m_elements[col_id].getValue(),
				"current":(cur_field_id==col_id)
			});
		}		
	}
	*/
	var self = this;
	WindowSearch.show({
		"text":str,
		"columns":columns,
		"callBack":function(res,params){
			self.m_grid.focus();
			if (res==WindowSearch.RES_OK){
				self.doSearch(params);
			}
		}
	});
}

GridCmdSearch.prototype.onCommand = function(){
	this.showDialog("");
}

GridCmdSearch.prototype.onUnset = function(){
	
	if (this.m_filter){
		this.m_grid.unsetFilter(this.m_filter);

		var pag = this.m_grid.getPagination();
		if (pag)pag.reset();
		var self = this;
		this.m_grid.onRefresh(function(){
			self.m_unsetCtrl.setEnabled(false);
			self.m_grid.focus();
		});
	}
}

GridCmdSearch.prototype.doSearch = function(params){
	if (params.search_str){
		//console.log("GridCmdSearch.prototype.doSearch "+params.search_str+" how="+params.how+" where="+params.where);
		var pm = this.m_grid.getReadPublicMethod();
		var contr = pm.getController();
//debugger
		var s_pref = (params.how=="on_part")? "%":"";
		var s_posf = (params.how=="on_part"||params.how=="on_beg")? "%":"";
		
		var pm = this.m_grid.getReadPublicMethod();
		var contr = pm.getController();
		
		//previous search cleaning
		if (this.m_filter){
			this.m_grid.unsetFilter(this.m_filter);
		}
		
		this.m_filter = {
			"field": params.where,
			"sign": (params.how!="on_match")? contr.PARAM_SGN_LIKE:contr.PARAM_SGN_EQUAL,
			"val": s_pref+params.search_str+s_posf,
			"icase":(params.how!="on_match")? "1":"0"
		};
		this.m_grid.setFilter(this.m_filter);
		
		var pag = this.m_grid.getPagination();
		if (pag)pag.reset();
		var self = this;
		this.m_grid.onRefresh(function(){
			self.m_unsetCtrl.setEnabled(true);
		});
		
	}
}

/* protected*/


/* public methods */
GridCmdSearch.prototype.setGrid = function(v){
	GridCmdSearch.superclass.setGrid.call(this,v);
	
	var self = this;
	
	v.setOnSearch(function(e){
		var ch = (e && e.char)? e.char:null;
		if (ch){
			self.m_grid.setFocused(false);
			self.showDialog(ch);
			return true;		
		}
	});
	v.setOnSearchDialog(function(){
		self.onCommand();
	});
	v.setOnSearchReset(function(){
		self.onUnset();
	});
	
}
