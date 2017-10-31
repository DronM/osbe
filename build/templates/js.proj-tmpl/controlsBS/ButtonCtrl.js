/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires controls/Button.js
*/

/* constructor */
function ButtonCtrl(id,options){
	options = options || {};
	options.className = "btn btn-default";
	
	ButtonCtrl.superclass.constructor.call(
		this,id,options);
}
extend(ButtonCtrl,Button);
