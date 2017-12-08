/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017
 * @class
 * @classdesc Grid column Enumerator class base class
 
 * @extends GridColumn
 
 * @requires core/extend.js
 * @requires controls/GridColumn.js
 
 * @param {object} options
 * @param {object} options.multyLangValues
 */
function GridColumnEnum(options){
	
	options.assocValueList = options.multyLangValues[window.getApp().getLocale()];
	
	GridColumnEnum.superclass.constructor.call(this,options);
}
extend(GridColumnEnum,GridColumn);

/* Constants */


/* private members */

/* protected*/


/* public methods */

