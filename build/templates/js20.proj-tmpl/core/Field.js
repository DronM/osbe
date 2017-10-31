/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2014
 
 * @class
 * @classdesc

 * @requires core/CommonHelper.js
  
 * @param {string} id - Field identifier
 * @param {Object} options
 */
function Field(id,options){
	options = options || {};	
	
	if (!options.validator){
		throw new Error(CommonHelper.format(this.ER_NO_VALIDATOR,[id]));
	}
	
	this.setId(id);
	this.setValidator(options.validator);	
	this.setDataType(options.dataType);
	this.setAlias(options.alias);

	if (options.defValue!=undefined){
		this.setDefValue(options.defValue);
	}
	else{
		this.m_defValue = undefined;
	}
	
	if (options.value!=undefined){
		this.setValue(options.value);
	}
	else{
		this.m_value = undefined;
	}
	
	this.setPrimaryKey((options.primaryKey!=undefined)? options.primaryKey:false);
	this.setAutoInc((options.autoInc!=undefined)? options.autoInc:false);
}

/* Constants */
Field.prototype.DT_INT = 0;
Field.prototype.DT_INT_UNSIGNED = 1;
Field.prototype.DT_STRING = 2;
Field.prototype.DT_FLOAT_UNSIGNED = 3;
Field.prototype.DT_FLOAT = 4;
Field.prototype.DT_CUR_RUR = 5;
Field.prototype.DT_CUR_USD = 6;
Field.prototype.DT_BOOL = 7;
Field.prototype.DT_TEXT = 8;
Field.prototype.DT_DATETIME = 9;
Field.prototype.DT_DATE = 10;
Field.prototype.DT_TIME = 11;
Field.prototype.DT_OBJECT = 12;
Field.prototype.DT_FILE = 13;
Field.prototype.DT_PWD = 14;
Field.prototype.DT_EMAIL = 15;
Field.prototype.DT_ENUM = 16;
Field.prototype.DT_GEOM_POLYGON = 17;
Field.prototype.DT_GEOM_POINT = 18;
Field.prototype.DT_INTERVAL = 19;
Field.prototype.DT_DATETIMETZ = 20;
Field.prototype.DT_JSON = 21;
Field.prototype.DT_JSONB = 22;
Field.prototype.DT_ARRAY = 23;
Field.prototype.DT_XML = 24;
Field.prototype.DT_INT_BIG = 25;
Field.prototype.DT_INT_SMALL = 26;

Field.prototype.OLD_PREF = "old_";

/* private members */
Field.prototype.m_id;
Field.prototype.m_alias;
Field.prototype.m_value;
Field.prototype.m_primaryKey;
Field.prototype.m_defValue;
Field.prototype.m_validator;
Field.prototype.m_dataType;

/* protected*/


/* public methods */
Field.prototype.setId = function(id){
	this.m_id = id;
}
Field.prototype.getId = function(){
	return this.m_id;
}
Field.prototype.getOldId = function(){
	return this.OLD_PREF+this.m_id;
}

Field.prototype.setPrimaryKey = function(v){
	this.m_primaryKey = v;
}
Field.prototype.getPrimaryKey = function(){
	return this.m_primaryKey;
}

Field.prototype.setDefValue = function(v){
	//if (v!==null){
		v = this.m_validator.correctValue(v);
		this.m_validator.validate(v);
	//}
	this.m_defValue = v;
}
Field.prototype.getDefValue = function(){
	return this.m_defValue;
}
Field.prototype.setAlias = function(v){
	this.m_alias = v;
}
Field.prototype.getAlias = function(){
	return this.m_alias||this.m_id;
}

Field.prototype.setValidator = function(v){
	this.m_validator = v;
}
Field.prototype.getValidator = function(){
	return this.m_validator;
}

Field.prototype.setDataType = function(v){
	this.m_dataType = v;
}
Field.prototype.getDataType = function(){
	return this.m_dataType;
}

Field.prototype.setValue = function(v){
	//if (v!==null){
		v = this.m_validator.correctValue(v);
		this.m_validator.validate(v);
	//}
	this.m_value = v;
}

Field.prototype.resetValue = function(){
	var req = this.m_validator.getRequired();
	if (req) this.m_validator.setRequired(false);
	
	this.setValue(null);
	
	this.m_validator.setRequired(req);
}

Field.prototype.validate = function(value){
	this.getValidator().validate(value);
}


Field.prototype.getValue = function(arInd){
	if (arInd && this.m_value && this.m_value.length>arInd){
		return this.m_value[arInd];
	}
	else{
		return this.m_value;
	}
}
Field.prototype.getValueXHR = function(){
	//encodeURIComponent(
	return this.getValue();
}

Field.prototype.isNull = function(){
	//return this.getValidator().isNull(this.getValue(),this.getDefValue());
	return (
		(this.getValue()===null)
		&&
		(this.getDefValue()===null)
	);	
}

Field.prototype.isSet = function(){
	return (
		this.getValue()!==undefined
		||
		this.getDefValue()!==undefined
	);
}


Field.prototype.setAutoInc = function(v){
	this.m_autoInc = v;
}
Field.prototype.getAutoInc = function(){
	return this.m_autoInc;
}

Field.prototype.unsetValue = function(){
	this.m_value = undefined;
}
