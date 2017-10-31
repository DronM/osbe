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
function DOCOrderAppendGridDb(id,options){
	options = options || {};	
	
	DOCOrderAppendGridDb.superclass.constructor.call(this,id,options);
}
extend(DOCOrderAppendGridDb,GridDb);

/* Constants */


/* private members */

