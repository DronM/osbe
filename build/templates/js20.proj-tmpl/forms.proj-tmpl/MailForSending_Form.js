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
function MailForSending_Form(options){
	options = options || {};	
	
	options.formName = "MailForSending";
	options.controller = "MailForSending_Controller";
	options.method = "get_object";
	
	MailForSending_Form.superclass.constructor.call(this,options);
	
}
extend(MailForSending_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

