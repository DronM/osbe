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
function ButtonSmall(id,options){
	options = options || {};
	options.className = "btn btn-xs";
	
	ButtonSmall.superclass.constructor.call(
		this,id,options);
}
extend(ButtonSmall,Button);
