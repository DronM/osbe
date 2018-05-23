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
function GridCmdRowUp(id,options){
	options = options || {};	

	options.glyph = "glyphicon-arrow-up";
	options.buttonClass = ButtonCtrl;
	options.showCmdControl = (options.showCmdControl!=undefined)? options.showCmdControl:false;
	
	GridCmdRowUp.superclass.constructor.call(this,id,options);
		
}
extend(GridCmdRowUp,GridCmd);

/* Constants */


/* private members */

/* protected*/


/* public methods */
GridCmdRowUp.prototype.onCommand = function(){
	this.m_grid.onRowUp();
}
