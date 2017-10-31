/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends ControllerAjx
 * @requires core/extend.js  

 * @class
 * @classdesc
 
 * @param {namespace} options
 * @param {Model} options.listModel
 * @param {Model} options.objModel   
 */
function ControllerAjxDb(options){
	options = options || {};
	
	if (options.listModel){
		this.setListModel(options.listModel);
	}
	if (options.objModel){
		this.setObjModel(options.objModel);
	}	
	
	ControllerAjxDb.superclass.constructor.call(this,options);
	
}
extend(ControllerAjxDb,ControllerAjx);

/* constants */
ControllerAjxDb.prototype.METH_INSERT = "insert";
ControllerAjxDb.prototype.METH_UPDATE = "update";
ControllerAjxDb.prototype.METH_GET_OBJ = "get_object";
ControllerAjxDb.prototype.METH_GET_LIST = "get_list";
ControllerAjxDb.prototype.METH_DELETE = "delete";
ControllerAjxDb.prototype.METH_COMPLETE = "complete";

ControllerAjxDb.prototype.PARAM_COUNT = "count";
ControllerAjxDb.prototype.PARAM_FROM = "from";
ControllerAjxDb.prototype.PARAM_IC = "ic";
ControllerAjxDb.prototype.PARAM_MID = "mid";//LIKE %str%
ControllerAjxDb.prototype.PARAM_ORD_FIELDS = "ord_fields";
ControllerAjxDb.prototype.PARAM_ORD_DIRECTS = "ord_directs";
ControllerAjxDb.prototype.PARAM_FIELD_SEP_VAL = "@";
ControllerAjxDb.prototype.PARAM_COND_FIELDS = "cond_fields";
ControllerAjxDb.prototype.PARAM_COND_SGNS = "cond_sgns";
ControllerAjxDb.prototype.PARAM_COND_VALS = "cond_vals";
ControllerAjxDb.prototype.PARAM_COND_ICASE = "cond_ic";
ControllerAjxDb.prototype.PARAM_SGN_EQUAL = "e";
ControllerAjxDb.prototype.PARAM_SGN_LESS = "l";
ControllerAjxDb.prototype.PARAM_SGN_GREATER = "g";
ControllerAjxDb.prototype.PARAM_SGN_LESS_EQUAL = "le";
ControllerAjxDb.prototype.PARAM_SGN_GREATER_EQUAL = "ge";
ControllerAjxDb.prototype.PARAM_SGN_LIKE = "lk";
ControllerAjxDb.prototype.PARAM_SGN_NOT_EQUAL = "ne";
ControllerAjxDb.prototype.PARAM_ORD_ASC = "a";
ControllerAjxDb.prototype.PARAM_ORD_DESC = "d";
ControllerAjxDb.prototype.PARAM_GRP_FIELDS = "grp_fields";
ControllerAjxDb.prototype.PARAM_AGG_FIELDS = "agg_fields";
ControllerAjxDb.prototype.PARAM_AGG_TYPES = "agg_types";
ControllerAjxDb.prototype.PARAM_RET_ID = "ret_id";
ControllerAjxDb.prototype.PARAM_FIELD_SEP = "field_sep";

/* private members*/
ControllerAjxDb.prototype.m_listModelId;
ControllerAjxDb.prototype.m_objModelId;

/* private functions */	
ControllerAjxDb.prototype.addDefParams = function(pm){	
	pm.addField(new FieldString(this.PARAM_CONTROLLER,{value:this.getId()}));
	pm.addField(new FieldString(this.PARAM_METH,{value:pm.getId()}));
	pm.addField(new FieldString(this.PARAM_VIEW,{value:this.PARAM_VIEW_VALUE}));
}

/* protected functions */	
ControllerAjxDb.prototype.addInsert = function(){
	return this.addMethod(this.METH_INSERT);
}
ControllerAjxDb.prototype.getInsert = function(){
	return this.getPublicMethod(this.METH_INSERT);
}
ControllerAjxDb.prototype.addUpdate = function(){
	return this.addMethod(this.METH_UPDATE);
}
ControllerAjxDb.prototype.getUpdate = function(){
	return this.getPublicMethod(this.METH_UPDATE);
}

ControllerAjxDb.prototype.addDelete = function(){
	return this.addMethod(this.METH_DELETE);
}
ControllerAjxDb.prototype.getDelete = function(){
	return this.getPublicMethod(this.METH_DELETE);
}

ControllerAjxDb.prototype.addGetObject = function(){
	return this.addMethod(this.METH_GET_OBJ);
}
ControllerAjxDb.prototype.getGetObject = function(){	
	return this.getPublicMethod(this.METH_GET_OBJ);
}

ControllerAjxDb.prototype.addGetList = function(){
	var pm = this.addMethod(this.METH_GET_LIST);
	pm.addField(new FieldInt(this.PARAM_COUNT));
	pm.addField(new FieldInt(this.PARAM_FROM));
	pm.addField(new FieldString(this.PARAM_ORD_FIELDS));
	pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));
	pm.addField(new FieldString(this.PARAM_COND_FIELDS));
	pm.addField(new FieldString(this.PARAM_COND_SGNS));
	pm.addField(new FieldString(this.PARAM_COND_VALS));
	pm.addField(new FieldString(this.PARAM_COND_ICASE));
	pm.addField(new FieldString(this.PARAM_FIELD_SEP));
	return pm;
}
ControllerAjxDb.prototype.getGetList = function(){
	return this.getPublicMethod(this.METH_GET_LIST,{controller:this});
}

/* Public functions*/
ControllerAjxDb.prototype.setObjModel = function(objModel){
	this.m_objModel = objModel;
}
ControllerAjxDb.prototype.getObjModel = function(){
	return this.m_objModel;
}
ControllerAjxDb.prototype.setListModel = function(listModel){
	this.m_listModel = listModel;
}
ControllerAjxDb.prototype.getListModel = function(){
	return this.m_listModel;
}

ControllerAjxDb.prototype.addComplete = function(){
	var pm = this.addMethod(this.METH_COMPLETE);
	pm.addField(new FieldInt(this.PARAM_COUNT));
	pm.addField(new FieldInt(this.PARAM_IC));
	pm.addField(new FieldInt(this.PARAM_MID));
	pm.addField(new FieldString(this.PARAM_ORD_FIELDS));
	return pm;
}
ControllerAjxDb.prototype.getComplete = function(){
	return this.getPublicMethod(this.METH_COMPLETE);
}

ControllerAjxDb.prototype.addMethod = function(methId){	
	var pm = new PublicMethodAjx(methId,{controller:this});
	this.addDefParams(pm);
	this.addPublicMethod(pm);	
	return pm;
}

/**
 * stub
 */
ControllerAjxDb.prototype.getPrintList = function(){	
	return null;
}
