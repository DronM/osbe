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
function GridCmdCopy(id,options){
	options = options || {};	

	options.glyph = "glyphicon-copy";
	options.showCmdControl = false;
	
	GridCmdCopy.superclass.constructor.call(this,id,options);
		
}
extend(GridCmdCopy,GridCmd);

/* Constants */


/* private members */

/* protected*/


/* public methods */
GridCmdCopy.prototype.onCommand = function(){
	this.m_grid.onCopy();
}
