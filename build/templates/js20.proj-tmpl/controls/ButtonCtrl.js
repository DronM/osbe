/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>,2012

 * @class
 * @classdesc Bsic control button

 * @extends Button

 * @requires core/extend.js  
 * @requires controls/Button.js

 * @param {string} id Object identifier
 * @param {namespace} options
*/
function ButtonCtrl(id,options){
	options = options || {};
	options.className = "btn btn-default";
	
	this.setEditControl(options.editControl);
	
	ButtonCtrl.superclass.constructor.call(this,id,options);
}
extend(ButtonCtrl,Button);

ButtonCtrl.prototype.m_editControl;

ButtonCtrl.prototype.setEditControl = function(v){
	this.m_editControl = v;
}
ButtonCtrl.prototype.getEditControl = function(){
	return this.m_editControl;
}
