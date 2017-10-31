/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
*/

/* constructor */
function Field(id,options){
	options = options || {};	
	this.setId(id);
	if (options.alias){
		this.setAlias(options.alias);
	};	
	if (options.value){
		this.setValue(options.value);
	};
	//
	this.setDataType(options.dataType || this.DT_STRING);
	this.setPrimaryKey((options.primaryKey!=undefined)? options.primaryKey:this.DEF_PRIMARY_KEY);
	if (options.len){
		this.setLength(options.len);	
	}
	this.setRequired((options.required!=undefined)? options.required:this.DEF_REQUIRED);
	this.setReadOnly((options.readOnly!=undefined)? options.readOnly:this.DEF_READ_ONLY);
	this.setMinLength(options.minLength || this.DEF_MIN_LENGTH);
	//
	if (options.validator){
		this.setValidator(options.validator);
	};
	//
	if (options.defValue){
		this.setDefValue(options.defValue);
	};
	
}
/* Constants */
Field.prototype.DT_STRING=0;
Field.prototype.DT_INT=1;
Field.prototype.DT_FLOAT=2;
Field.prototype.DT_DATE=3;
Field.prototype.DT_DATETIME=4;
Field.prototype.DT_TIME=5;
Field.prototype.DT_TEXT=6;
Field.prototype.DT_ENUM=7;
Field.prototype.DT_GEOM_POINT=8;
Field.prototype.DT_GEOM_POLYGON=9;

Field.prototype.DEF_PRIMARY_KEY=false;
Field.prototype.DEF_REQUIRED=false;
Field.prototype.DEF_READ_ONLY=false;
Field.prototype.DEF_MIN_LENGTH=0;

Field.prototype.ER_NO_VALUE = "поле '%s' - пустое значение";
Field.prototype.ER_TOO_LONG_VALUE = "поле '%s' - значение слишком длинное";
Field.prototype.ER_TOO_SHORT_VALUE = "поле '%s' - значение слишком короткое";
Field.prototype.ER_INVALID_VALUE = "поле '%s' - не верное значение";

/* private members */
Field.prototype.m_id;
Field.prototype.m_alias;
Field.prototype.m_value;
Field.prototype.m_dataType;
Field.prototype.m_primaryKey;
Field.prototype.m_length;
Field.prototype.m_required;
Field.prototype.m_defValue;
Field.prototype.m_readOnly;
Field.prototype.m_minLength;

Field.prototype.m_validator;

/* private methods */

/* protected */
Field.prototype.correctValue = function(value){
	return value;
}
Field.prototype.getValueForQuery = function(){
	var v = this.getValue();
	if (typeof v!="object"){
		v = encodeURIComponent(v);
	}
	return (v);
}


/* public methods */
Field.prototype.setId = function(id){
	this.m_id = id;
}
Field.prototype.getId = function(){
	return this.m_id;
}
Field.prototype.setAlias = function(alias){
	this.m_alias = alias;
}
Field.prototype.getAlias = function(){
	return this.m_alias || this.m_id;
}

Field.prototype.setValue = function(value){
	this.m_value = this.correctValue(value);
}
Field.prototype.getValue = function(arInd){
	if (arInd!=undefined){
		if (this.m_value.length>arInd){
			return this.m_value[arInd];
		}
	}
	else{
		return this.m_value;
	}
}
Field.prototype.setDefValue = function(value){
	this.m_value = this.correctValue(value);
}
Field.prototype.getDefValue = function(){
	return this.m_defValue;
}

Field.prototype.setDataType = function(dataType){
	this.m_dataType = dataType;
}
Field.prototype.getDataType = function(){
	return this.m_dataType;
}
Field.prototype.setPrimaryKey = function(primaryKey){
	this.m_primaryKey = primaryKey;
}
Field.prototype.getPrimaryKey = function(){
	return this.m_primaryKey;
}

Field.prototype.setLength = function(len){
	this.m_length = len;
}
Field.prototype.getLength = function(){
	return this.m_length;
}

Field.prototype.setRequired = function(required){
	this.m_required = required;
}
Field.prototype.getRequired = function(){
	return this.m_required;
}
Field.prototype.setReadOnly = function(readOnly){
	this.m_readOnly = readOnly;
}
Field.prototype.getReadOnly = function(){
	return this.m_readOnly;
}
Field.prototype.setMinLength = function(minLength){
	this.m_minLength = minLength;
}
Field.prototype.getMinLength = function(){
	return this.m_minLength;
}
Field.prototype.setValidator = function(validator){
	this.m_validator = validator;
}
Field.prototype.getValidator = function(){
	return this.m_validator;
}

/*
	value validation && correction
	1) not filled but required and has no de value		
	2) too long
	3) too short
	4) not valid value
*/
Field.prototype.isEmpty = function(){
	var val = this.getValue();
	var def_val = this.getDefValue();
	return (val==undefined && def_val==undefined);
}
Field.prototype.isTooLong = function(){
	var len = this.getLength();
	return (len!=undefined
			&& this.getValue()
			&& len<this.getValue().length);
}
Field.prototype.isTooShort = function(){
	var min_len = this.getMinLength();
	return (min_len!=undefined
			&& this.getValue()
			&& min_len>this.getValue().length);
}
	
Field.prototype.isValid = function(comment){
	var valid = true;
	var no_val = this.isEmpty();
	var er;
	if (no_val && this.getRequired()){
		er = this.ER_NO_VALUE;
		valid = false;
	}
	else if (this.isTooLong()){
		er = this.ER_TOO_LONG_VALUE;
		valid = false;
	}
	else if (this.isTooShort()){
		er = this.ER_TOO_SHORT_VALUE;
		valid = false;
	}
	else if (!no_val){
		var v = this.getValidator();
		if (v){
			valid = v.isValid(this.getValue());
			if (!valid){
				er = this.ER_INVALID_VALUE;
			}				
		}
	}
	if (!valid && er){
		comment = format(er,Array(this.getAlias()));
		alert(comment);
	}
	return valid;
}
Field.prototype.getQueryString = function(){
	if (!this.isEmpty()){
		return (this.getId()+"="+this.getValueForQuery());
	}
}