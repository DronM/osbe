/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc
 
 * @extends WindowFormObject	
 
 * @param {namespace} options
 * @param {string} options.formName
 * @param {string} options.method
 * @param {string} options.controller   
 */	
function ViewList_Form(options){
	options = options || {};	
	
	options.formName = "ViewList";
	options.controller = "View_Controller";
	options.method = "get_list";
	
	ViewList_Form.superclass.constructor.call(this,options);
		
}
extend(ViewList_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

