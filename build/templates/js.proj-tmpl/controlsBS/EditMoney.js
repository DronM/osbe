/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
  * @requires core/ValidatorFloat.js
  * @requires controls/EditNum.js
  * @requires extra/JSLib/Textbox.Restriction.js
*/

/* constructor */
function EditMoney(id,options){
	options = options || {};
	options.attrs=options.attrs||{};
	options.attrs.size=options.attrs.size||"8";
	options.attrs.maxlength=options.attrs.maxlength||"15";
	options.attrs.precision=options.attrs.precision||"2";
	EditMoney.superclass.constructor.call(this,id,options);
}
extend(EditMoney,EditFloat);