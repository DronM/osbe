/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc
	
 * @param {string} id view identifier
 * @param {namespace} options
 */	
function DOCDateEdit(id,options){
	options = options || {};
	
	var tm = options.value;
	if (tm==undefined){
		tm = DateHelper.time();
		tm.setHours(0,0,0,0);
	}	
	options.value = tm;
	
	options.labelCaption = options.labelCaption || "от:";
	options.contClassName = options.contClassName || "form-group";
	DOCDateEdit.superclass.constructor.call(this,id,options);
}
extend(DOCDateEdit,EditDateTime);

/* Constants */


/* private members */

/* protected*/


/* public methods */

