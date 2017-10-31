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
function DataSource(controller,options){
	options = options || {};
	this.setRefreshTime(options.refreshTime || this.DEF_REFRESH_TIME);
	this.m_controller = controller;
	this.m_publicMethodId = options.publicMethodId || controller.METH_GET_LIST;
	this.m_modelId = options.modelId;	
	
	this.m_maxWaitForQuery = options.maxWaitForQuery || this.MAX_WAIT_FOR_QUERY;
	
	this.setTopBufferRecCount(options.topBufferRecCount || this.DEF_TOP_BUF_REC_COUNT);
	this.setBottomBufferRecCount(options.bottomBufferRecCount || this.DEF_BOTTOM_BUF_REC_COUNT);
	this.setVisibleRecCount(options.visibleRecCount || this.DEF_VIS_REC_COUNT);	
	
	this.m_keyFieldArray=[];
	this.m_keysDefined = false;
	this.m_queryParams = {};
	this.m_queryParams[this.QUERY_TYPES.start] =
		{"count":this.getTotalRecCount(),
		 "from":0
		};
	this.m_queryParams[this.QUERY_TYPES.top] =
		{"count":this.getTopBufferRecCount(),
		 "from":null
		};
	this.m_queryParams[this.QUERY_TYPES.bottom] =
		{"count":this.getBottomBufferRecCount(),
		 "from":null
		};
	this.m_queryParams[this.QUERY_TYPES.all] =
		{"count":this.getTotalRecCount(),
		 "from":null
		};		
	
	/*
		condition fields are resolved in following order
		1) if order by param in controller is defined
		2) if there is a specific Model class with MetaData description
		3) in setModel() function if there is a preset data
			and there is a specific Model class with MetaData description
		4) last attempt: set md=1 parameter in initial query
			for obtaining MetaData from server
	*/
	var pm = this.m_controller.getPublicMethodById(this.m_publicMethodId);
	var ord_fields_str = pm.getParamValue(controller.PARAM_ORD_FIELDS);
	if (ord_fields_str){
		//order by fields are defined
		var ord_directs_str = pm.getParamValue(controller.PARAM_ORD_DIRECTS);
		this.defineCondFields(
			ord_fields_str.split(","),
			(ord_directs_str)? ord_directs_str.split(","):[]);
	}
	else if (this.m_modelId){
		this.defineCondFieldsOnModelId();
	}		
	
	//preset data
	if (options.model){
		this.setModel(options.model);
	}
	
	/* Set references to condition params
		for faster access
	*/
	this.m_parCondValues = pm.getParamById(controller.PARAM_COND_VALS);	
	this.m_parCondSignes = pm.getParamById(controller.PARAM_COND_SGNS);	
	this.m_parCondFields = pm.getParamById(controller.PARAM_COND_FIELDS);	
	var cond_fields_str = this.m_parCondFields.getValue();
	this.m_condParamIndex = (cond_fields_str)?
				cond_fields_str.split(",").length:0;
}
/* constants */
DataSource.prototype.DEF_REFRESH_TIME = 0;//no update
DataSource.prototype.DEF_TOP_BUF_REC_COUNT = 10;
DataSource.prototype.DEF_BOTTOM_BUF_REC_COUNT = 10;
DataSource.prototype.DEF_VIS_REC_COUNT = 30;
DataSource.prototype.DEF_NO_BUFFER = false;
DataSource.prototype.MAX_WAIT_FOR_QUERY = 10*1000;//5sec
DataSource.prototype.ER_REQUEST_NOT_DEFINED = "Request not found.";
DataSource.prototype.ER_NOT_ACTIVE = "Not active.";
DataSource.prototype.ER_COND_FIELDS_NOT_DEFINED = "Не смогли определить поля условий.";

/*
start - initial data request
	from 0, with count
top	- requests data for the top buffer
	less than the first record
bottom - requests data for the bottom buffer
	greater than the last record
all - requests data refresh. buffers and visible
	not necessaraly from the begining
*/
DataSource.prototype.QUERY_TYPES = {"start":0,"top":1,"bottom":2,"all":3};

/* private members */
DataSource.prototype.m_maxWaitForQuery;
DataSource.prototype.m_refreshTime;
DataSource.prototype.m_bottomBufferRecCount;
DataSource.prototype.m_topBufferRecCount;
DataSource.prototype.m_model;
DataSource.prototype.m_modelId;
DataSource.prototype.m_visibleRecCount;

//id of the refresh timer
DataSource.prototype.m_timerId;

//order field ids
DataSource.prototype.m_keyFieldArray;

/* references to Public method parameters
	for faster access
*/
DataSource.prototype.m_parCondValues;
DataSource.prototype.m_parCondSignes;	
DataSource.prototype.m_parCondFields;

//structure[query_id] queryType(QUERY_TYPE),count
DataSource.prototype.m_requests;
DataSource.prototype.m_queryParams;
DataSource.prototype.m_condParamIndex;

/* private methods */
DataSource.prototype.defineCondFields = function(fieldAr,dirAr){
	var dir_asc;
	for (var i=0;i<fieldAr.length;i++){
		this.m_keyFieldArray.push(fieldAr[i]);
		dir_asc = (dirAr && dirAr.length>i)?
			(dirAr[i]==this.m_controller.PARAM_ORD_ASC):true;
			
		this.m_queryParams[this.QUERY_TYPES.top][fieldAr[i]] =
			{"sgn": (dir_asc)?
				this.m_controller.PARAM_SGN_LESS:
				this.m_controller.PARAM_SGN_GREATER,
			"value":null
			};
		this.m_queryParams[this.QUERY_TYPES.bottom][fieldAr[i]] =
			{"sgn":(dir_asc)?
				this.m_controller.PARAM_SGN_GREATER:
				this.m_controller.PARAM_SGN_LESS,
			"value":null
			};
		this.m_queryParams[this.QUERY_TYPES.all][fieldAr[i]] =
			{"sgn":(dir_asc)?
				this.m_controller.PARAM_SGN_GREATER_EQUAL:
				this.m_controller.PARAM_SGN_LESS_EQUAL,
			"value":null
			};		
	}
	this.m_keysDefined = true;
}
DataSource.prototype.defineCondFieldsOnModelId = function(){
	if (eval("typeof "+this.m_modelId+"== 'function'")){
		/*model class is defined - take primary keys
			with asc order
		*/
		var fields_ar = [];
		var model = eval("new "+this.m_modelId+"()");
		var fields = model.getFields();
		for (var field_id in fields){
			if (fields[field_id].getPrimaryKey()){
				fields_ar.push(field_id);
			}
		}
		this.defineCondFields(fields_ar);
	}		
}
DataSource.prototype.updateFirstRecCondVals = function(){
	var pos = this.m_model.getRowPos();
	this.m_model.setFirstRow();
	var val,field_id;
	for (var i=0;i<this.m_keyFieldArray.length;i++){
		field_id = this.m_keyFieldArray[i];
		val = this.m_model.getFieldById(field_id).getValue();
		this.m_queryParams[this.QUERY_TYPES.top][field_id].value=val;
		this.m_queryParams[this.QUERY_TYPES.all][field_id].value=val;
	}
	this.m_model.setRowPos(pos);
}
DataSource.prototype.updateLastRecCondVals = function(){
	var pos = this.m_model.getRowPos();
	this.m_model.setLastRow();
	var val,field_id;
	for (var i=0;i<this.m_keyFieldArray.length;i++){
		field_id = this.m_keyFieldArray[i];
		val = this.m_model.getFieldById(field_id).getValue();
		this.m_queryParams[this.QUERY_TYPES.bottom][field_id].value=val;
	}
	this.m_model.setRowPos(pos);
}

/*
inner objects initialization
*/
DataSource.prototype.clear = function(){
	if (this.m_timerId){
		clearInterval(this.m_timerId);
		delete this.m_timerId;
	}		
	if (this.m_model){
		delete this.m_model;
	}				
	if (this.m_requests){
		delete this.m_requests;
	}
	this.m_requests = {};
}

DataSource.prototype.onGetData = function(resp,reqId){
	//alert("Got data id="+reqId);
	if (!this.m_requests[reqId]){
		throw new Error(this.ER_REQUEST_NOT_DEFINED);
	}
	
	var query_type = this.m_requests[reqId].queryType;
	
	var resp_model = resp.getModelById(this.m_modelId);	
	var whole_model = (query_type==this.QUERY_TYPES.start
					|| query_type==this.QUERY_TYPES.all);
	//coping model
	resp_model.setActive(true);
	if (!this.m_keysDefined){
		//last resort,from metaData
		//ToDo
	}	
	if (!this.m_keysDefined){
		throw new Error(this.ER_COND_FIELDS_NOT_DEFINED);
	}
	
	if (whole_model&&this.m_model){
		delete this.m_model;
	}		
	if (whole_model){
		this.m_model = resp_model;
		this.updateFirstRecCondVals();
		this.updateLastRecCondVals();
	}
	else if (query_type==this.QUERY_TYPES.top){
		var count = resp_model.getRowCount();
		var from = this.getTotalRecCount()-
				this.getBottomBufferRecCount();
		this.m_model.deleteRows(from,count);
		var fields = this.m_model.getFields();
		resp_model.setLastRow();
		while (resp_model.getPreviousRow()){			
			this.m_model.insertRow(0);
			for (var field_id in fields){
				var val;
				if (resp_model.fieldExists(field_id)){
					val = resp_model.getFieldById(field_id).getValue();
				}
				this.m_model.getFieldById(field_id).setValue(val);
			}
			this.m_model.post();
		}
		this.updateFirstRecCondVals();
	}
	else if (query_type==this.QUERY_TYPES.bottom){
		var count = resp_model.getRowCount();
		var row_pos = this.m_model.getRowPos();		
		var deleted_rows = 0;
		try{
			deleted_rows = this.m_model.deleteRows(0,count);
			var fields = this.m_model.getFields();
			while (resp_model.getNextRow()){			
				this.m_model.appendRow();
				for (var field_id in fields){
					var val;
					if (resp_model.fieldExists(field_id)){
						val = resp_model.getFieldById(field_id).getValue();
					}
					this.m_model.getFieldById(field_id).setValue(val);
				}
				this.m_model.post();
			}	
			this.updateLastRecCondVals();
		}
		finally{
			this.m_model.setRowPos(row_pos-deleted_rows);
		}
	}
	
	//setting up refresh timer
	if (this.m_refreshTime && !this.m_timerId){
		this.m_timerId = setInterval(this.refreshDataOnTimer,this.m_refreshTime);
	}
	var ret = this.m_requests[reqId].ret;
	delete this.m_requests[reqId];
	if (ret && ret.func){
		ret.func.call(ret.context);
	}
	
}
DataSource.prototype.refreshData = function(queryType,retFunc,retContext){
	var ASYNC = true;	
	
	var params = {};
	params[this.m_controller.PARAM_FROM] = this.m_queryParams[queryType].from;
	params[this.m_controller.PARAM_COUNT] = this.m_queryParams[queryType].count;
	
	if (queryType!=this.QUERY_TYPES.start){		
		var cond_fields = this.m_parCondFields.getValue();
		var cond_values = this.m_parCondValues.getValue();
		var cond_signes = this.m_parCondSignes.getValue();
		cond_fields = (cond_fields)? cond_fields.split(","):[];		
		cond_values = (cond_values)? cond_values.split(","):[];		
		cond_signes = (cond_signes)? cond_signes.split(","):[];
		var field_id;
		var ind = this.m_condParamIndex;
		for (var i=0;i<this.m_keyFieldArray.length;i++){
			field_id = this.m_keyFieldArray[i];
			cond_fields[ind] = field_id;
			cond_signes[ind] = 
				this.m_queryParams[queryType][field_id].sgn;
			cond_values[ind] = 
				this.m_queryParams[queryType][field_id].value;
			ind++;	
		}
		
		this.m_parCondFields.setValue(cond_fields.join());
		this.m_parCondSignes.setValue(cond_signes.join());
		this.m_parCondValues.setValue(cond_values.join());
	}
	
	if (!this.m_keysDefined){
		//get metadata from server
		//params["md"] = 1;
	}
	
	//sending request
	//this.m_controller.waitUntillFree(this.m_maxWaitForQuery);		
	var req_id = this.m_controller.runPublicMethod(this.m_publicMethodId,
		params,ASYNC,this.onGetData,this);
	this.m_requests[req_id] = {
			"queryType":queryType,
			"ret":{"func":retFunc,"context":retContext}
		};
}
DataSource.prototype.refreshDataOnTimer = function(){
	this.refreshData(this.QUERY_TYPES.all);
}
/* public methods */
DataSource.prototype.setRefreshTime = function(refreshTime){
	this.m_refreshTime = refreshTime;
}
DataSource.prototype.getRefreshTime = function(){
	return this.m_refreshTime;
}
DataSource.prototype.setTopBufferRecCount = function(count){
	this.m_topBufferRecCount = count;
}
DataSource.prototype.getTopBufferRecCount = function(){
	return this.m_topBufferRecCount;
}
DataSource.prototype.setBottomBufferRecCount = function(count){
	this.m_bottomBufferRecCount = count;
}
DataSource.prototype.getBottomBufferRecCount = function(){
	return this.m_bottomBufferRecCount;
}
DataSource.prototype.setVisibleRecCount = function(count){
	this.m_visibleRecCount = count;
}
DataSource.prototype.getVisibleRecCount = function(){
	return this.m_visibleRecCount;
}

DataSource.prototype.setActive = function(active,retFunc,retContext){
	this.clear();
	if (active){
		//getting new data
		this.refreshData(this.QUERY_TYPES.start,retFunc,retContext);
	}
	this.m_active = active;
}
DataSource.prototype.getActive = function(){
	return this.m_active;
}
DataSource.prototype.getModel = function(){
	return this.m_model;
}
DataSource.prototype.setModel = function(model){
	this.m_model = model;
	this.m_modelId = model.getId();
	if (!this.m_queryParams){
		this.defineCondFieldsOnModelId();
	}
}
DataSource.prototype.getNextRow = function(){
	if (!this.getActive()
		|| !this.m_model
		|| !this.m_model.getActive()){
		throw new Error(this.ER_NOT_ACTIVE);
	}
	if (!this.m_model.isLastRow()){
		var new_pos = this.m_model.getRowPos()+1;
		this.m_model.setRowPos(new_pos);
		var buf_start = this.m_topBufferRecCount+this.m_visibleRecCount;
		if (new_pos==buf_start){
			//hitting the first buffer record
			//need to get more records to buffer			
			this.refreshData(this.QUERY_TYPES.bottom);
			//alert("after buf send request");
		}		
		return true;
	}
	
	return false;
}
DataSource.prototype.getTotalRecCount = function(){
	return this.getTopBufferRecCount()+
		this.getVisibleRecCount()+
		this.getBottomBufferRecCount();
}