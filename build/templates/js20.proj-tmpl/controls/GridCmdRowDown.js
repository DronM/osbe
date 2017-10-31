/* Copyright (c) 2017 
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
function GridCmdRowDown(id,options){
	options = options || {};	

	options.glyph = "glyphicon-arrow-down";
	options.buttonClass = ButtonCtrl;
	options.showCmdControl = true;
	
	GridCmdRowDown.superclass.constructor.call(this,id,options);
		
}
extend(GridCmdRowDown,GridCmd);

/* Constants */


/* private members */

/* protected*/


/* public methods */
GridCmdRowDown.prototype.onCommand = function(){
	this.m_grid.onRowDown();
}
