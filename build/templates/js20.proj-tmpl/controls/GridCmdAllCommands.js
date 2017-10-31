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
function GridCmdAllCommands(id,options){
	options = options || {};	

	options.glyph = "glyphicon-collapse-down";
	options.caption = this.CAPTION;
	options.showCmdControl = true;
	options.showCmdControlInPopup = false;
	
	GridCmdAllCommands.superclass.constructor.call(this,id,options);
		
}
extend(GridCmdAllCommands,GridCmd);


/* Constants */


/* private members */
GridCmdAllCommands.prototype.onCommand = function(e){
	var m = this.m_grid.getPopUpMenu();
	if (m){
		if (m.getVisible()){
			m.hide();
		}
		else{
			m.show(e,this.m_controls[0].getNode());	
		}
	}	
}

/* protected*/


/* public methods */

