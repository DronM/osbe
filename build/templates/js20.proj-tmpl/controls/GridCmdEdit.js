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
function GridCmdEdit(id,options){
	options = options || {};	

	options.glyph = "glyphicon-pencil";
	options.showCmdControl = false;
	
	GridCmdEdit.superclass.constructor.call(this,id,options);
		
}
extend(GridCmdEdit,GridCmd);

/* Constants */


/* private members */

/* protected*/


/* public methods */
GridCmdEdit.prototype.onCommand = function(){
	this.m_grid.onEdit();
}
