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
function Tree(id,options){
	options = options || {};
	options.className = options.className || this.DEF_CLASS;
	
	Tree.superclass.constructor.call(this,
		id,"ul",options);		
		
}
extend(Tree,ControlContainer);

Tree.prototype.DEF_CLASS = "Container";