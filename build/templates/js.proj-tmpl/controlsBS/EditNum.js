/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
  * @requires core/ValidatorInt.js  
  * @requires controls/Edit.js
  * @requires controls/ButtonCalc.js      
  * @requires extra/JSLib/Textbox.Restriction.js
*/

/* constructor */
function EditNum(id,options){
	options = options||{};
	options.validator = options.validator||new ValidatorInt();
	
	//if (options.noCalc==undefined||
	//(options.noCalc!=undefined&&options.noCalc==false)
	//){
	/*
	if (options.calc==undefined){
		options.calc = true;
	}
	*/
	if (options.calc&&(options.noSelect==undefined
	||(options.noSelect!=undefined&&options.noSelect==false))){
		options.buttonSelect = new ButtonCalc(id+"_btn_open",
		{"winObj":options.winObj,
		"enabled":options.enabled
		});
	}
	if (options.maxValue){
		this.setMaxValue(options.maxValue);
	}
	if (options.minValue){
		this.setMinValue(options.minValue);
	}
	if (options.notZero!=undefined){
		this.setNotZero(options.notZero);
	}
	
	this.m_unsigned=!(options.unsigned!=undefined&&!options.unsigned);
	
	EditNum.superclass.constructor.call(this,id,options);
	
}
extend(EditNum,Edit);

/* constants */

/* public methods */

EditNum.prototype.toDOM = function(parent){
	EditNum.superclass.toDOM.call(this,parent);
	var dig_type = (this.m_unsigned)? InputType.NonnegativeInteger:InputType.WholeNumber;
	InitializeTextbox(this.m_node, dig_type);
}
/*
EditNum.prototype.getValue = function(){
	var v = EditNum.superclass.getValue.call(this);
	return (isNaN(v))?
}
*/
EditNum.prototype.validate = function(val){	
	var v = Number(val);
	if (this.m_maxValue&&v>Number(this.m_maxValue)){
		this.setNotValid("Значение больше максимального "+this.m_maxValue);
	}
	if (this.m_minValue&&v<Number(this.m_minValue)){
		this.setNotValid("Значение меньше минимального "+this.m_minValue);
	}
	if (this.m_notZero&&v==0){
		this.setNotValid("Значение равно нулю");
	}		
	return EditNum.superclass.validate.call(this,val);
}
EditNum.prototype.setMinValue = function(val){	
	this.m_minValue = val;
}
EditNum.prototype.setMaxValue = function(val){	
	this.m_maxValue = val;
}
EditNum.prototype.setNotZero = function(val){	
	this.m_notZero = val;
}