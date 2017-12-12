/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016

 * @extends
 * @requires

 * @class
 * @classdesc

 * @param {string||namespace} id depricated syntax. new syntax - with options as the first parameter!
 * @param {Object} options
 */
function GridColumnBool(options){
	options = options || {};	
	
	options.assocClassList = {"true":"glyphicon glyphicon-ok","false":"glyphicon glyphicon-remove"};
	GridColumnBool.superclass.constructor.call(this,options);
}
extend(GridColumnBool,GridColumn);

/* Constants */


/* private members */

/* protected*/


/* public methods */

