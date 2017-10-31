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
function EditSelectOptionRef(id,options){
	options = options || {};	
	
	EditSelectOptionRef.superclass.constructor.call(this,id,options);
}
extend(EditSelectOptionRef,EditSelectOption);

/* Constants */


/* private members */

/* protected*/


/* public methods */
EditSelectOptionRef.prototype.getValue = function(){
	var str = EditSelectOptionRef.superclass.getValue.call(this);
	return CommonHelper.json2obj(str);
}
EditSelectOptionRef.prototype.setValue = function(keys){
	var str = CommonHelper.array2json(keys);
	EditSelectOptionRef.superclass.setValue.call(this,str);
}


