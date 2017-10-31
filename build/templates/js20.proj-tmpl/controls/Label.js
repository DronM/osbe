/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>,2016

 * @class
 * @classdesc grid object
  
 * @requires core/extend.js
 * @requires controls/Control.js
 
 * @param {string} id Object identifier
 * @param {Object} options
 * @param {string} options.caption - synonym of options.value
 */
function Label(id,options){
	options = options || {};
	options.className = (options.className!==undefined)? options.className : (this.DEF_CLASS+" "+window.getBsCol(this.DEF_COL_WD));
	
	options.value = options.value || options.caption;
	
	Label.superclass.constructor.call(this,id,(options.tagName || this.DEF_TAG_NAME),options);		
}
extend(Label,Control);

Label.prototype.DEF_TAG_NAME = "label";
Label.prototype.DEF_CLASS = "control-label";
Label.prototype.DEF_COL_WD = "4";
