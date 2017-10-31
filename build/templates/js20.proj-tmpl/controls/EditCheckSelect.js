/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @requires core/extend.js  

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 * @param {string} options.className
 * @param {int} [options.trueValue=1]
 * @param {string} [options.trueDescr=DEF_TRUE_DESCR] 
 * @param {int} [options.falseValue=0]
 * @param {string} [options.falseDescr=DEF_FALSE_DESCR]  
 */
function EditCheckSelect(id,options){
	options = options || {};	
	
	options.optionClass = options.optionClass || EditSelectOption;
	
	options.options = [
		{
			"value":options.trueValue || "1",
			"descr":options.trueDescr || this.DEF_TRUE_DESCR
		},
		
		{
			"value":options.falseValue || "0",
			"descr":options.falseDescr || this.DEF_FALSE_DESCR
		}
	];
	
	
	
	EditCheckSelect.superclass.constructor.call(this,id,options);
}
extend(EditCheckSelect,EditSelect);

/* Constants */


/* private members */

/* protected*/


/* public methods */

