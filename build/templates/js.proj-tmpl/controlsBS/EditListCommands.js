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
function EditListCommands(id,options){
	options = options || {};
	
	options.btnClass = ButtonSmall;
	options.noCopy = true;
	options.noPrint = true;
	options.noExport = true;
	options.noRefresh = true;
	
	
	EditListCommands.superclass.constructor.call(this,
		id,options);
	
//	this.m_btn
//	this.addElement()
}
extend(EditListCommands,GridCommands);

/* Constants */


/* private members */

/* protected*/


/* public methods */

