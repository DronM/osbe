/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends
 * @requires core/extend.js  

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 * @param {string} options.className
 */
function ViewTemplate(id,options){
	options = options || {};	
	
	var t_opts = ((typeof(options.value)=="string")? CommonHelper.unserialize(options.value):options.value) || {};
	if (options.templateOptions){
		for (var opt in options.templateOptions){
			t_opts[opt] = options.templateOptions[opt];
		}
	}
	options.templateOptions = t_opts;
	options.value = null;
	
	ViewTemplate.superclass.constructor.call(this,id,"DIV",options);
}
extend(ViewTemplate,Control);

/* Constants */


/* private members */

/* protected*/


/* public methods */

ViewTemplate.prototype.setValue = function(){
}
/*
ViewTemplate.prototype.setValue = function(v){
console.log("ViewTemplate.prototype.setValue v=");
	if (typeof(v)=="string"){
		v = CommonHelper.unserialize(v);
	}
	this.setTemplateOptions(v);
}
*/
