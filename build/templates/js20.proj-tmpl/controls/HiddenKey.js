/* Copyright (c) 2016 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
/** Requirements
 * @requires 
 * @requires core/extend.js  
*/

/* constructor
@param string id
@param object options{

}
*/
function HiddenKey(id,options){
	options = options || {};	
	
	options.visible = false;
	
	this.setValidator(options.validator);
	
	HiddenKey.superclass.constructor.call(this,id,"DIV",options);
}
extend(HiddenKey,ControlForm);

