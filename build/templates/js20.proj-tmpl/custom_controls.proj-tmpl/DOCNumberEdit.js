/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc
	
 * @param {string} id view identifier
 * @param {namespace} options
 */	
function DOCNumberEdit(id,options){
	options = options || {};	
	options.labelCaption="Номер:";
	options.contClassName = options.contClassName || "form-group";
	options.labelClassName = options.labelClassName || window.getApp().getBsCol(5);
	options.editContClassName = "input-group "+window.getApp().getBsCol(5);  
	options.enabled = (options.enabled!=undefined)? options.enabled:false;
	options.cmdClear = false;
	options.maxlength = 10;
	
	DOCNumberEdit.superclass.constructor.call(this,id,options);
}
extend(DOCNumberEdit,EditString);

/* Constants */


/* private members */

/* protected*/


/* public methods */

