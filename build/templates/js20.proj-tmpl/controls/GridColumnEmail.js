/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends GridColumn
 * @requires controls/GridColumn.js

 * @class
 * @classdesc
 
 * @param {Object} options
 * @param {Field} [options.mask=DefAppMask] 
 */
function GridColumnEmail(id,options){
	options = options || {};	
	
	//options.mask = 
	GridColumnEmail.superclass.constructor.call(this,id,options);
}
extend(GridColumnEmail,GridColumn);

/* Constants */


/* private members */

/* protected*/


/* public methods */

