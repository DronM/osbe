/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends GridColumn
 * @requires controls/GridColumn.js

 * @class
 * @classdesc
 
 * @param {Object} options
 * @param {Field} [options.mask=DefAppMask] 
 */
function GridColumnPhone(id,options){
	options = options || {};	
	
	options.mask = options.mask || window.getApp().getPhoneEditMask();
	GridColumnPhone.superclass.constructor.call(this,id,options);
}
extend(GridColumnPhone,GridColumn);

/* Constants */


/* private members */

/* protected*/


/* public methods */

