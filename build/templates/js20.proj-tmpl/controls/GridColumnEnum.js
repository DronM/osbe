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
function GridColumnEnum(id,options){
	options = options || {};	
	
	options.assocValueList = options.multyLangValues[window.getApp().getLocale()];
	
	GridColumnEnum.superclass.constructor.call(this,id,options);
}
extend(GridColumnEnum,GridColumn);

/* Constants */


/* private members */

/* protected*/


/* public methods */

