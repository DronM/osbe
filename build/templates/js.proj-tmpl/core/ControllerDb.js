/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires common/functions.js 
 * @requires core/Controller.js
 * @requires core/Field.js
  * @requires core/FieldInt.js
 * @requires core/FieldSys.js 
*/

/* constructor */
function ControllerDb(id,servConnector,options){
	ControllerDb.superclass.constructor.call(this,id,servConnector);
	options = options || {};
	if (options.listModelId){
		this.setListModelId(options.listModelId);
	}
	if (options.objModelId){
		this.setObjModelId(options.objModelId);
	}	
}
extend(ControllerDb,Controller);

/* constants */
ControllerDb.prototype.METH_INSERT = "insert";
ControllerDb.prototype.METH_UPDATE = "update";
ControllerDb.prototype.METH_GET_OBJ = "get_object";
ControllerDb.prototype.METH_GET_LIST = "get_list";
ControllerDb.prototype.METH_DELETE = "delete";
ControllerDb.prototype.METH_COMPLETE = "complete";

ControllerDb.prototype.PARAM_VIEW_VALUE = "ViewXML";
ControllerDb.prototype.PARAM_CONTROLLER = "c";
ControllerDb.prototype.PARAM_METH = "f";
ControllerDb.prototype.PARAM_VIEW = "v";
ControllerDb.prototype.PARAM_OLD_ID = "old_id";
ControllerDb.prototype.PARAM_COUNT = "count";
ControllerDb.prototype.PARAM_FROM = "from";
ControllerDb.prototype.PARAM_IC = "ic";
ControllerDb.prototype.PARAM_MID = "mid";//LIKE %str%
ControllerDb.prototype.PARAM_ORD_FIELDS = "ord_fields";
ControllerDb.prototype.PARAM_ORD_DIRECTS = "ord_directs";
ControllerDb.prototype.PARAM_COND_FIELDS = "cond_fields";
ControllerDb.prototype.PARAM_COND_SGNS = "cond_sgns";
ControllerDb.prototype.PARAM_COND_VALS = "cond_vals";
ControllerDb.prototype.PARAM_COND_ICASE = "cond_ic";
ControllerDb.prototype.PARAM_SGN_EQUAL = "e";
ControllerDb.prototype.PARAM_SGN_LESS = "l";
ControllerDb.prototype.PARAM_SGN_GREATER = "g";
ControllerDb.prototype.PARAM_SGN_LESS_EQUAL = "le";
ControllerDb.prototype.PARAM_SGN_GREATER_EQUAL = "ge";
ControllerDb.prototype.PARAM_SGN_LIKE = "lk";
ControllerDb.prototype.PARAM_SGN_NOT_EQUAL = "ne";
ControllerDb.prototype.PARAM_ORD_ASC = "a";
ControllerDb.prototype.PARAM_ORD_DESC = "d";
ControllerDb.prototype.PARAM_GRP_FIELDS = "grp_fields";
ControllerDb.prototype.PARAM_AGG_FIELDS = "agg_fields";
ControllerDb.prototype.PARAM_AGG_TYPES = "agg_types";
ControllerDb.prototype.PARAM_GROUPS = "groups";
ControllerDb.prototype.PARAM_RET_ID = "ret_id";
ControllerDb.prototype.PARAM_FIELD_SEP = "field_sep";

/* private members*/
ControllerDb.prototype.m_listModelId;
ControllerDb.prototype.m_objModelId;

/* private functions */	
ControllerDb.prototype.addDefParams = function(pm){	
	pm.addParam(new FieldSys(this.PARAM_CONTROLLER,this.getId()));			
	pm.addParam(new FieldSys(this.PARAM_METH,pm.getId()));
	pm.addParam(new FieldSys(this.PARAM_VIEW,this.PARAM_VIEW_VALUE));
}

/* protected functions */	
ControllerDb.prototype.addInsert = function(){
	return this.addMethodById(this.METH_INSERT);
}
ControllerDb.prototype.getInsert = function(){
	return this.getPublicMethodById(this.METH_INSERT);
}
ControllerDb.prototype.addUpdate = function(){
	return this.addMethodById(this.METH_UPDATE);
}
ControllerDb.prototype.getUpdate = function(){
	return this.getPublicMethodById(this.METH_UPDATE);
}

ControllerDb.prototype.addDelete = function(){
	return this.addMethodById(this.METH_DELETE);
}
ControllerDb.prototype.getDelete = function(){
	return this.getPublicMethodById(this.METH_DELETE);
}

ControllerDb.prototype.addGetObject = function(){
	return this.addMethodById(this.METH_GET_OBJ);
}
ControllerDb.prototype.getGetObject = function(){	
	return this.getPublicMethodById(this.METH_GET_OBJ);
}

ControllerDb.prototype.addGetList = function(){
	var pm = this.addMethodById(this.METH_GET_LIST);
	pm.addParam(new FieldInt(this.PARAM_COUNT));
	pm.addParam(new FieldInt(this.PARAM_FROM));
	pm.addParam(new Field(this.PARAM_ORD_FIELDS));
	pm.addParam(new Field(this.PARAM_ORD_DIRECTS));
	pm.addParam(new Field(this.PARAM_COND_FIELDS));
	pm.addParam(new Field(this.PARAM_COND_SGNS));
	pm.addParam(new Field(this.PARAM_COND_VALS));
	pm.addParam(new Field(this.PARAM_COND_ICASE));
	pm.addParam(new Field(this.PARAM_FIELD_SEP));
	return pm;
}
ControllerDb.prototype.getGetList = function(){
	return this.getPublicMethodById(this.METH_GET_LIST);
}

/* Public functions*/
ControllerDb.prototype.setObjModelId = function(objModelId){
	this.m_objModelId = objModelId;
}
ControllerDb.prototype.getObjModelId = function(){
	return this.m_objModelId;
}
ControllerDb.prototype.setListModelId = function(listModelId){
	this.m_listModelId = listModelId;
}
ControllerDb.prototype.getListModelId = function(){
	return this.m_listModelId;
}
ControllerDb.prototype.addComplete = function(){
	var pm = this.addMethodById(this.METH_COMPLETE);
	pm.addParam(new FieldInt(this.PARAM_COUNT));
	pm.addParam(new FieldInt(this.PARAM_IC));
	pm.addParam(new FieldInt(this.PARAM_MID));
	pm.addParam(new Field(this.PARAM_ORD_FIELDS));
	return pm;
}
ControllerDb.prototype.getComplete = function(){
	return this.getPublicMethodById(this.METH_COMPLETE);
}

ControllerDb.prototype.addMethodById = function(methId){	
	var pm = new PublicMethod(methId);
	this.addDefParams(pm);
	//async = (async==undefined)? false:async;
	/*
	this[methId] =
		function(retFuncOk,retFuncError,retCont){
			this.runPublicMethod(methId,{},async,retFuncOk,retCont,retFuncError);
	}
	*/
	this.addPublicMethod(pm);	
	return pm;
}
