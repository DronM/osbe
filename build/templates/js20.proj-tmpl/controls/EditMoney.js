/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires controls/EditFloat.js
*/

/* constructor */
function EditMoney(id,options){
	options = options || {};
	options.attrs = options.attrs||{};
	
	options.attrs.maxlength = "15";
	options.precision = "2";
	EditMoney.superclass.constructor.call(this,id,options);
}
extend(EditMoney,EditFloat);
/*
EditMoney.prototype.setValue = function(val){
	if (val==undefined){
		this.getNode().value = "";
	}
	else{
		if (this.m_validator){
			val = this.m_validator.correctValue(val);
		}
		//console.log( CommonHelper.numberFormat(val, this.m_precision, CommonHelper.getDecimalSeparator(), "") );
		this.getNode().value = val.toFixed(2);//CommonHelper.numberFormat(val.toFixed(2), this.m_precision, ".", "");
	}
}
*/
