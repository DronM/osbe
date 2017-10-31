/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires common/functions.js
*/

/* constructor */
function WindowFormModalDD(options){
	options = options || {};	
	WindowFormModalDD.superclass.constructor.call(this,options);	
	
	this.m_formClass = dhtmlmodal;
}
extend(WindowFormModalDD,WindowFormDD);