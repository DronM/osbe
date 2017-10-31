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
function DataSource(modelId,controller,options){
	options = options || {};
	this.setRefreshTime(options.refreshTime || this.DEF_REFRESH_TIME);
	this.setNoBuffer(options.noBuffer || this.DEF_NO_BUFFER);
	var no_buffer = this.getNoBuffer();
	this.m_controller = controller;
	this.m_publicMethodId = options.publicMethodId || controller.METH_GET_LIST;
	this.m_modelId = modelId;	
	
	this.m_maxWaitForQuery = options.maxWaitForQuery || this.MAX_WAIT_FOR_QUERY;
	
	if (!no_buffer){
		this.setTopBufferRecCount(options.topBufferRecCount || this.DEF_TOP_BUF_REC_COUNT);
		this.setButtomBufferRecCount(options.buttomBufferRecCount || this.DEF_BOTTOM_BUF_REC_COUNT);
		this.setVisibleRecCount(options.visibleRecCount || this.DEF_VIS_REC_COUNT);	
		
		this.m_condFieldsDefined = false;
		this.m_firstRecCondVals = {};
		this.m_lastRecCondVals = {};
		
		var pm = this.m_controller.getPublicMethodById(this.m_publicMethodId);
		var fields_str = pm.getParamValue(controller.PARAM_ORD_FIELDS);
		if (fields_str){
			//order by fields are defined
			this.defineCondFields(fields_str.split(","));
		}
		else if (eval("typeof "+this.m_modelId+"== 'function'")){
			//model class is defined - take primary keys
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
		
		this.m_queryParams = {};
		this.m_queryParams[this.QUERY_TYPES.start] = {"from":0};
		this.m_queryParams[this.QUERY_TYPES.top] =
			{"signe":this.m_controller.PARAM_SGN_LESS};
		this.m_queryParams[this.QUERY_TYPES.bottom] =
			{"signe":this.m_controller.PARAM_SGN_GREATER};
		this.m_queryParams[this.QUERY_TYPES.all] =
			{"signe":this.m_controller.PARAM_SGN_GREATER_EQUAL};
		
		this.m_parCondValues = pm.getParamById(controller.PARAM_COND_VALS);	
		this.m_parCondSignes = pm.getParamById(controller.PARAM_COND_SGNS);	
		this.m_parCondFields = pm.getParamById(controller.PARAM_COND_FIELDS);	
	}	
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

/*
start - initial data request
	from 0, with count if buffer is activated
top	- requests data for the top buffer
	less than the first record
buttom - requests data for the bottom buffer
	greater than the last record
all - requests data refresh. buffers and visible
	not necessaraly from the begining
*/
DataSource.prototype.QUERY_TYPES = {"start":0,"top":1,"buttom":2,"all":3};

/* private members */
DataSource.prototype.m_maxWaitForQuery;
DataSource.prototype.m_refreshTime;
DataSource.prototype.m_buttomBufferRecCount;
DataSource.prototype.m_topBufferRecCount;
DataSource.prototype.m_model;
DataSource.prototype.m_modelId;
DataSource.prototype.m_visibleRecCount;

//id of the refresh timer
DataSource.prototype.m_timerId;

//order field values of the first record
DataSource.prototype.m_firstRecCondVals;
DataSource.prototype.m_lastRecCondVals;

/* references to Public method parameters
	for faster access
*/
DataSource.prototype.m_parCondValues;
DataSource.prototype.m_parCondSignes;	
DataSource.prototype.m_parCondFields;

//structure[query_id] queryType(QUERY_TYPE),count
DataSource.prototype.m_requests;
DataSource.prototype.m_activeQueries;
DataSource.prototype.m_queryParams;
DataSource.prototype.m_condParamIndex;
//array of order by fields or if no - primary keys
DataSource.prototype.m_condFields;

/* private methods */
DataSource.prototype.defineCondFields = function(fieldArray){
	for (var i=0;i<fieldArray.length;i++){
		this.m_firstRecCondVals[fieldArray[i]] = null;
		this.m_lastRecCondVals[fieldArray[i]] = null;
	}
	this.m_condFieldsDefined = true;
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
	this.m_activeBufferQuery = false;	
}

DataSource.prototype.onGetData = function(resp,reqId){
	if (this.m_requests[reqId]){
		throw new Error(this.ER_REQUEST_NOT_DEFINED);
	}
	
	if (!this.m_condFieldsDefined){
	}
	
	var ini_query = (this.m_requests[reqId].queryType==this.QUERY_TYPES.all);
	var resp_model = resp.getModelById(this.m_modelId);	
	//coping model
	if (this.m_model && ini_query){
		delete this.m_model;
	}
	resp_model.setActive(true);
	if (!this.m_model){
		this.m_model = clone(resp_model);
	}
	else{
		//setting middle data to our model
		this.m_requests[req_id].isTopBuffer
		//this.m_model.setRowPos(this.m_requests[reqId].);
	}
	
	if (resp_model.getRowCount() && ini_query){
		resp_model.setFirstRow();		
		this.m_firstRecOrdVals = {};
		for (var id in this.m_refreshCond){
			this.m_firstRecOrdVals[id] = resp_model.getFieldById(id).getValue();
		}			
	}
	delete this.m_requests[reqId];
	
	if (!ini_query){
		this.m_activeBufferQuery = false;
	}
	
	//setting up refresh timer
	if (this.m_refreshTime && !this.m_timerId){
		this.m_timerId = setInterval(this.refreshDataOnTimer,this.m_refreshTime);
	}
}
DataSource.prototype.refreshData = function(queryType){
	var async;	
	var from,count;
	if (queryType==this.QUERY_TYPES.start){
		if (!this.getNoBuffer()){
			from = 0;
			count =
				this.getTopBufferRecCount()+
				this.getVisibleRecCount()+
				this.getButtomBufferRecCount();
		}			
	}
	else if (queryType==this.QUERY_TYPES.all){
		if (!this.getNoBuffer()){
			count =
				this.getTopBufferRecCount()+
				this.getVisibleRecCount()+
				this.getButtomBufferRecCount();
		}				
	}
	else if (queryType==this.QUERY_TYPES.top){
		count = this.getTopBufferRecCount();
	}
	else if (queryType==this.QUERY_TYPES.bottom){
		count = this.getButtomBufferRecCount();
	}
	
	var params = {};
	if (from!=undefined){
		params[this.m_controller.PARAM_FROM] = from;
	}
	if (count!=undefined){
		params[this.m_controller.PARAM_COUNT] = count;
	}
	
	if (from==0){
		//getting data from the beggining
		async = false;
	}
	else{
		/*getting middle part data -
		need condition where id>=
		*/
		this.m_activeBufferQuery = true;
		async = true;
		var cond_fields = this.m_parCondFields.getValue().split(",");
		var cond_values = this.m_parCondValues.getValue().split(",");
		var cond_signes = this.m_parCondSignes.getValue().split(",");
		var cond_field_found;
		for (var id in this.m_firstRecOrdVals){
			cond_field_found = false;
			for (var ind=0;ind<cond_fields.length;ind++){
				if (cond_fields[ind]==id){
					cond_field_found = true;
					cond_values[ind] = this.m_refreshCond[id].value;
					break;
				}
			}
			if (!cond_field_found){
				cond_fields.push(id);				
				cond_signes.push(this.m_refreshCond[id].sgn);
				cond_values.push(this.m_refreshCond[id].value);
			}			
		}
		this.m_parCondFields.setValue(cond_fields.join());
		this.m_parCondSignes.setValue(cond_signes.join());
		this.m_parCondValues.setValue(cond_values.join());
	}
	
	//sending request
	this.m_controller.waitUntillFree(this.m_maxWaitForQuery);		
	var req_id = this.m_controller.runPublicMethod(this.m_publicMethodId,
		params,async,this.onGetData,this);
	this.m_requests[req_id] = {
			"queryType":queryType,
			"count":count
		};
}
DataSource.prototype.refreshDataOnTimer = function(){
	var count;
	if (!this.getNoBuffer()){
		count = this.getTopBufferRecCount()+
			this.getVisibleRecCount()+
			this.getButtomBufferRecCount();
	}
	this.refreshData(this.QUERY_TYPES.all,count);	
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
DataSource.prototype.setButtomBufferRecCount = function(count){
	this.m_buttomBufferRecCount = count;
}
DataSource.prototype.getButtomBufferRecCount = function(){
	return this.m_buttomBufferRecCount;
}
DataSource.prototype.setVisibleRecCount = function(count){
	this.m_visibleRecCount = count;
}
DataSource.prototype.getVisibleRecCount = function(){
	return this.m_visibleRecCount;
}

DataSource.prototype.setActive = function(active){
	this.clear();
	if (active){
		//getting new data
		var count;
		if (!this.getNoBuffer()){
			count = this.getTopBufferRecCount()+
				this.getVisibleRecCount()+
				this.getButtomBufferRecCount();
		}
		this.refreshData(this.QUERY_TYPES.all,count);
	}
	this.m_active = active;
}
DataSource.prototype.getActive = function(){
	return this.m_active;
}
DataSource.prototype.getModel = function(){
	return this.m_model;
}
DataSource.prototype.setNoBuffer = function(noBuffer){
	this.m_noBuffer = noBuffer;
	if (noBuffer){
		this.setTopBufferRecCount(0);
		this.setButtomBufferRecCount(0);
		this.setVisibleRecCount(0);	
	}
}
DataSource.prototype.getNoBuffer = function(){
	return this.m_noBuffer;
}
DataSource.prototype.getNextRow = function(){
	if (!this.getActive()
		|| !this.m_model
		|| !this.m_model.getActive()){
		throw new Error(this.ER_NOT_ACTIVE);
	}
	if (this.m_model.isLastRow()
		&& this.m_activeBufferQuery){
		/*no more rows including the buffer
		if there is a query on the way - wait
		otherwise - that is the end -
		no more records on server
		*/
		this.m_controller.waitUntillFree(this.m_maxWaitForQuery);
	}
	if (!this.m_model.isLastRow()){
		var new_pos = this.m_model.getRowPos()+1;
		this.m_model.setRowPos(new_pos);
		var buf_start = this.m_topBufferRecCount+this.m_visibleRecCount;
		if (new_pos==buf_start){
			//hitting the first buffer record
			//need to get more records to buffer
			
			//taking last buffer ids
			for (var id in this.m_refreshCond){
				this.m_refreshCond[id].value = 
					this.m_model.getFieldById(id).getValue();
			}
			this.refreshData(this.QUERY_TYPES.top,
				this.getButtomBufferRecCount());
		}		
		return true;
	}
	
	return false;
}