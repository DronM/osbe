/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends ControllerAjx
 * @requires core/extend.js  

 * @class
 * @classdesc
 
 * @param {namespace} options
 * @param {Model} options.listModelClass
 * @param {Model} options.objModelClass
 */
function ControllerObj(options){
	options = options || {};
	
	this.setListModelClass(options.listModelClass);
	this.setObjModelClass(options.objModelClass);
	
	ControllerObj.superclass.constructor.call(this,options);
	
}
extend(ControllerObj,Controller);

/* constants */
ControllerObj.prototype.METH_INSERT = "insert";
ControllerObj.prototype.METH_UPDATE = "update";
ControllerObj.prototype.METH_GET_OBJ = "get_object";
ControllerObj.prototype.METH_GET_LIST = "get_list";
ControllerObj.prototype.METH_DELETE = "delete";
ControllerObj.prototype.METH_COMPLETE = "complete";

ControllerObj.prototype.PARAM_COUNT = "count";
ControllerObj.prototype.PARAM_FROM = "from";
ControllerObj.prototype.PARAM_IC = "ic";
ControllerObj.prototype.PARAM_MID = "mid";//LIKE %str%
ControllerObj.prototype.PARAM_ORD_FIELDS = "ord_fields";
ControllerObj.prototype.PARAM_ORD_DIRECTS = "ord_directs";
ControllerObj.prototype.PARAM_FIELD_SEP_VAL = "@";
ControllerObj.prototype.PARAM_COND_FIELDS = "cond_fields";
ControllerObj.prototype.PARAM_COND_SGNS = "cond_sgns";
ControllerObj.prototype.PARAM_COND_VALS = "cond_vals";
ControllerObj.prototype.PARAM_COND_ICASE = "cond_ic";
ControllerObj.prototype.PARAM_SGN_EQUAL = "e";
ControllerObj.prototype.PARAM_SGN_LESS = "l";
ControllerObj.prototype.PARAM_SGN_GREATER = "g";
ControllerObj.prototype.PARAM_SGN_LESS_EQUAL = "le";
ControllerObj.prototype.PARAM_SGN_GREATER_EQUAL = "ge";
ControllerObj.prototype.PARAM_SGN_LIKE = "lk";
ControllerObj.prototype.PARAM_SGN_NOT_EQUAL = "ne";
ControllerObj.prototype.PARAM_ORD_ASC = "a";
ControllerObj.prototype.PARAM_ORD_DESC = "d";
ControllerObj.prototype.PARAM_GRP_FIELDS = "grp_fields";
ControllerObj.prototype.PARAM_AGG_FIELDS = "agg_fields";
ControllerObj.prototype.PARAM_AGG_TYPES = "agg_types";
ControllerObj.prototype.PARAM_RET_ID = "ret_id";
ControllerObj.prototype.PARAM_FIELD_SEP = "field_sep";

/* private members*/
ControllerObj.prototype.m_listModelClass;
ControllerObj.prototype.m_objModelClass;

/* private functions */	

/* protected functions */	

/** Stub
 */
ControllerObj.prototype.addDefParams = function(){
}

ControllerObj.prototype.addInsert = function(){
	return this.addMethod(this.METH_INSERT,"post");
}
ControllerObj.prototype.getInsert = function(){
	return this.getPublicMethod(this.METH_INSERT);
}
ControllerObj.prototype.addUpdate = function(){
	return this.addMethod(this.METH_UPDATE,"post");
}
ControllerObj.prototype.getUpdate = function(){
	return this.getPublicMethod(this.METH_UPDATE);
}

ControllerObj.prototype.addDelete = function(){
	return this.addMethod(this.METH_DELETE);
}
ControllerObj.prototype.getDelete = function(){
	return this.getPublicMethod(this.METH_DELETE);
}

ControllerObj.prototype.addGetObject = function(){
	return this.addMethod(this.METH_GET_OBJ);
}
ControllerObj.prototype.getGetObject = function(){	
	return this.getPublicMethod(this.METH_GET_OBJ);
}

ControllerObj.prototype.addGetList = function(){
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
ControllerObj.prototype.getGetList = function(){
	return this.getPublicMethod(this.METH_GET_LIST,{controller:this});
}

/* Public functions*/
ControllerObj.prototype.setObjModelClass = function(v){
	this.m_objModelClass = v;
}
ControllerObj.prototype.getObjModelClass = function(){
	return this.m_objModelClass;
}
ControllerObj.prototype.setListModelClass = function(v){
	this.m_listModelClass = v;
}
ControllerObj.prototype.getListModelClass = function(){
	return this.m_listModelClass;
}

ControllerObj.prototype.addComplete = function(){
	var pm = this.addMethod(this.METH_COMPLETE);
	pm.addField(new FieldInt(this.PARAM_COUNT));
	pm.addField(new FieldInt(this.PARAM_IC));
	pm.addField(new FieldInt(this.PARAM_MID));
	pm.addField(new FieldString(this.PARAM_ORD_FIELDS));
	return pm;
}
ControllerObj.prototype.getComplete = function(){
	return this.getPublicMethod(this.METH_COMPLETE);
}

ControllerObj.prototype.addMethod = function(methId,requestType){	
	var pm_class = this.getPublicMethodClass();
	var pm = new pm_class(methId,{"controller":this,"requestType":requestType});
	this.addDefParams(pm);
	this.addPublicMethod(pm);	
	return pm;
}

/**
 * stub
 */
ControllerObj.prototype.getPrintList = function(){	
	return null;
}
