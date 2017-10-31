/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc
	
 * @param {namespace} options
 */	
function AppCustom(options){
	options = options || {};
	options.lang = "rus";
	AppCustom.superclass.constructor.call(this,"CRM",options);
}
extend(AppCustom,App);

/* Constants */


/* private members */

/* protected*/


/* public methods */
AppCustom.prototype.formatError = function(erCode,erStr){
	return (erStr +( (erCode)? (", код:"+erCode):"" ) );
}

