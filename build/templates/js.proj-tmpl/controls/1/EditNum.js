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
	if (options.calc){
		options.buttonSelect = new ButtonCalc(id+"_btn_open",
		{"winObj":options.winObj});
	}
	if (options.maxValue){
		this.m_maxValue = options.maxValue;
	}
	if (options.minValue){
		this.m_minValue = options.minValue;
	}
	if (options.notZero){
		this.m_notZero=options.notZero;
	}
	
	EditNum.superclass.constructor.call(this,id,options);
	
}
extend(EditNum,Edit);

/* constants */

EditNum.prototype.applyEditMask = function(){
	InitializeTextbox(this.m_node, InputType.WholeNumber);	
}

/* public methods */

EditNum.prototype.toDOM = function(parent){
	EditNum.superclass.toDOM.call(this,parent);
	InitializeTextbox(this.m_node, InputType.WholeNumber);	
	//this.applyEditMask();
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
		this.setNotValid("Значение больше максимального");
	}
	if (this.m_minValue&&v<Number(this.m_minValue)){
		this.setNotValid("Значение меньше минимального");
	}
	if (this.m_notZero&&v==0){
		this.setNotValid("Значение равно нулю");
	}		
	return EditNum.superclass.validate.call(this,val);
}