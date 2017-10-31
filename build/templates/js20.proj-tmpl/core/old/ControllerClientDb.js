/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends ControllerLocal
 * @requires core/extend.js  

 * @class
 * @classdesc
 
 * @param {namespace} options
 */
function ControllerClientDb(options){
	options = options || {};	
	
	ControllerClientDb.superclass.constructor.call(this,options);
}
extend(ControllerClientDb,Controller);

/* constants */
ControllerClientDb.prototype.METH_INSERT = "insert";
ControllerClientDb.prototype.METH_UPDATE = "update";
ControllerClientDb.prototype.METH_GET_OBJ = "get_object";
ControllerClientDb.prototype.METH_GET_LIST = "get_list";
ControllerClientDb.prototype.METH_DELETE = "delete";
ControllerClientDb.prototype.METH_COMPLETE = "complete";

ControllerClientDb.prototype.PARAM_COUNT = "count";
ControllerClientDb.prototype.PARAM_FROM = "from";
ControllerClientDb.prototype.PARAM_IC = "ic";
ControllerClientDb.prototype.PARAM_MID = "mid";//LIKE %str%
ControllerClientDb.prototype.PARAM_ORD_FIELDS = "ord_fields";
ControllerClientDb.prototype.PARAM_ORD_DIRECTS = "ord_directs";
ControllerClientDb.prototype.PARAM_FIELD_SEP_VAL = "@";
ControllerClientDb.prototype.PARAM_COND_FIELDS = "cond_fields";
ControllerClientDb.prototype.PARAM_COND_SGNS = "cond_sgns";
ControllerClientDb.prototype.PARAM_COND_VALS = "cond_vals";
ControllerClientDb.prototype.PARAM_COND_ICASE = "cond_ic";
ControllerClientDb.prototype.PARAM_SGN_EQUAL = "e";
ControllerClientDb.prototype.PARAM_SGN_LESS = "l";
ControllerClientDb.prototype.PARAM_SGN_GREATER = "g";
ControllerClientDb.prototype.PARAM_SGN_LESS_EQUAL = "le";
ControllerClientDb.prototype.PARAM_SGN_GREATER_EQUAL = "ge";
ControllerClientDb.prototype.PARAM_SGN_LIKE = "lk";
ControllerClientDb.prototype.PARAM_SGN_NOT_EQUAL = "ne";
ControllerClientDb.prototype.PARAM_ORD_ASC = "a";
ControllerClientDb.prototype.PARAM_ORD_DESC = "d";
ControllerClientDb.prototype.PARAM_GRP_FIELDS = "grp_fields";
ControllerClientDb.prototype.PARAM_AGG_FIELDS = "agg_fields";
ControllerClientDb.prototype.PARAM_AGG_TYPES = "agg_types";
ControllerClientDb.prototype.PARAM_RET_ID = "ret_id";
ControllerClientDb.prototype.PARAM_FIELD_SEP = "field_sep";

/* private members*/

/* private functions */	
ControllerClientDb.prototype.addDefParams = function(pm){	
	pm.addField(new FieldString(this.PARAM_CONTROLLER,{value:this.getId()}));
	pm.addField(new FieldString(this.PARAM_METH,{value:pm.getId()}));
	pm.addField(new FieldString(this.PARAM_VIEW,{value:this.PARAM_VIEW_VALUE}));
}

/* protected functions */	
ControllerClientDb.prototype.addInsert = function(){
	return this.addMethod(this.METH_INSERT);
}
ControllerClientDb.prototype.getInsert = function(){
	return this.getPublicMethod(this.METH_INSERT);
}
ControllerClientDb.prototype.addUpdate = function(){
	return this.addMethod(this.METH_UPDATE);
}
ControllerClientDb.prototype.getUpdate = function(){
	return this.getPublicMethod(this.METH_UPDATE);
}

ControllerClientDb.prototype.addDelete = function(){
	return this.addMethod(this.METH_DELETE);
}
ControllerClientDb.prototype.getDelete = function(){
	return this.getPublicMethod(this.METH_DELETE);
}

ControllerClientDb.prototype.addGetObject = function(){
	return this.addMethod(this.METH_GET_OBJ);
}
ControllerClientDb.prototype.getGetObject = function(){	
	return this.getPublicMethod(this.METH_GET_OBJ);
}

ControllerClientDb.prototype.addGetList = function(){
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
ControllerClientDb.prototype.getGetList = function(){
	return this.getPublicMethod(this.METH_GET_LIST,{controller:this});
}

/* Public functions*/
ControllerClientDb.prototype.setObjModel = function(objModel){
	this.m_objModel = objModel;
}
ControllerClientDb.prototype.getObjModel = function(){
	return this.m_objModel;
}
ControllerClientDb.prototype.setListModel = function(listModel){
	this.m_listModel = listModel;
}
ControllerClientDb.prototype.getListModel = function(){
	return this.m_listModel;
}

ControllerClientDb.prototype.addComplete = function(){
	var pm = this.addMethod(this.METH_COMPLETE);
	pm.addField(new FieldInt(this.PARAM_COUNT));
	pm.addField(new FieldInt(this.PARAM_IC));
	pm.addField(new FieldInt(this.PARAM_MID));
	pm.addField(new FieldString(this.PARAM_ORD_FIELDS));
	return pm;
}
ControllerClientDb.prototype.getComplete = function(){
	return this.getPublicMethod(this.METH_COMPLETE);
}

ControllerClientDb.prototype.addMethod = function(methId){	
	var pm = new PublicMethod(methId,{controller:this});
	this.addDefParams(pm);
	this.addPublicMethod(pm);	
	return pm;
}

