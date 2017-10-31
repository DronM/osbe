/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>,2016

 * @class
 * @classdesc
 
 * @requires core/extend.js  
 * @requires controls/GridCmd.js

 * @param {string} id Object identifier
 * @param {namespace} options
*/
function GridCmdExport(id,options){
	options = options || {};	

	options.showCmdControl = false;
	options.glyph = "glyphicon-file";

	GridCmdExport.superclass.constructor.call(this,id,options);
		
}
extend(GridCmdExport,GridCmd);

/* Constants */


/* private members */

/* protected*/


/* public methods */
GridCmdExport.prototype.onCommand = function(){
	this.m_grid.getReadPublicMethod().download("ViewExcel");
}

