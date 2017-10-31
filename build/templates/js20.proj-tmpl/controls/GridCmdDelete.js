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
function GridCmdDelete(id,options){
	options = options || {};	
	
	options.glyph = "glyphicon-remove";
	options.showCmdControl = false;
	
	GridCmdDelete.superclass.constructor.call(this,id,options);
		
}
extend(GridCmdDelete,GridCmd);

/* Constants */


/* private members */

/* protected*/


/* public methods */
GridCmdDelete.prototype.onCommand = function(){
	this.m_grid.onDelete();
}
