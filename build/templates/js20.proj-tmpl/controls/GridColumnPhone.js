/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends GridColumn
 * @requires controls/GridColumn.js
 * @requires core/AppWin.js 

 * @class
 * @classdesc
 
 * @param {Object} options
 * @param {string} [options.mask=App.getPhoneEditMask] 
 */
function GridColumnPhone(options){
	options = options || {};	
	
	options.mask = options.mask || window.getApp().getPhoneEditMask();
	GridColumnPhone.superclass.constructor.call(this,options);
}
extend(GridColumnPhone,GridColumn);

/* Constants */


/* private members */

/* protected*/


/* public methods */

