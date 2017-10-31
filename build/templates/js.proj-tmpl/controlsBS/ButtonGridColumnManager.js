/* Copyright (c) 2016 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
/** Requirements
 * @requires 
 * @requires core/extend.js  
*/

/* constructor
@param string id
@param object options{

}
*/
function ButtonGridColumnManager(id,options){
	options = options || {};	
	options.glyph = "glyphicon-th-list";
	options.attrs = options.attrs || "Открыть настройку колонок";
	
	var self = this;
	options.onClick = function(){
		self.openManager();
	};
	
	ButtonGridColumnManager.superclass.constructor.call(this,id,options);
}
extend(ButtonGridColumnManager,ButtonCtrl);

/* Constants */


/* private members */

/* protected*/


/* public methods */
ButtonGridColumnManager.prototype.openManager = function(){
	this.m_modalId = uuid();
	this.m_modal = new WindowFormModalBS(this.m_modalId,{
		"content":new ViewGridColumnManager(uuid())
	});
	
	this.m_modal.open();
	
}
