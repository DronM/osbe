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
function GridCmdRefresh(id,options){
	options = options || {};	

	options.glyph = "glyphicon-refresh";
	options.showCmdControl = false;
	
	GridCmdRefresh.superclass.constructor.call(this,id,options);
		
}
extend(GridCmdRefresh,GridCmd);

/* Constants */


/* private members */

/* protected*/


/* public methods */
GridCmdRefresh.prototype.onCommand = function(){
	this.m_grid.onRefresh();
}
