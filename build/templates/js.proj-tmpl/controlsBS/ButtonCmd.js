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
function ButtonCmd(id,options){
	options = options || {};
	options.className = "btn btn-primary btn-cmd";
	
	ButtonCmd.superclass.constructor.call(
		this,id,options);
}
extend(ButtonCmd,Button);
