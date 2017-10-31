/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires core/extend.js
  * @requires core/ValidatorInt.js  
  * @requires controls/EditString.js
  * @requires controls/ButtonCalc.js      
*/

/* constructor */
function EditInt(id,options){
	options = options||{};
	
	options.type = "number";
	options.validator = options.validator || new ValidatorInt(options);

	options.attrs = options.attrs || {};
	
	if (options.minValue){
		options.attrs.min = options.minValue;
	}

	if (options.maxValue){
		options.attrs.max = options.maxValue;
	}
	
	options.cmdClear = (options.cmdClear!=undefined)? options.cmdClear:false;
	
	if (options.cmdSelect==undefined || (options.cmdSelect!=undefined && options.cmdSelect)){
		options.buttonSelect = options.buttonSelect || new ButtonCalc(id+":btn_open",
		{"winObj":options.winObj,
		"enabled":options.enabled,
		"editControl":this
		});
	}
	
	EditInt.superclass.constructor.call(this,id,options);	
	
	
	this.m_allowedChars = [8,0];//del,arrows
	
	if (this.m_validator && !this.m_validator.getUnsigned()){
		this.m_allowedChars.push(45);//Sign
	}
	
}

extend(EditInt,EditString);

/* constants */


EditInt.prototype.m_allowedChars;

EditInt.prototype.handleKeyPress = function(e){
	//console.log("which="+e.which);	
	if (jQuery.inArray(e.which,this.m_allowedChars)==-1 && (e.which < 48 || e.which > 57)) {
	     	return false;	
	}
}

/* public methods */

EditInt.prototype.toDOM = function(parent){
	EditInt.superclass.toDOM.call(this,parent);

	var self = this;
	$(this.getNode()).keypress(function (e) {		
		return self.handleKeyPress(e);
        });
}

/*
EditInt.prototype.getValue = function(){
	var v = EditInt.superclass.getValue.call(this);
	return (parseInt(v));
}
*/
