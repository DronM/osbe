/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires controls/View.js
*/

/* constructor */
function ViewList(id,options){
	options = options || {};
	options.tagName = options.tagName || this.DEF_TAG_NAME;
	ViewList.superclass.constructor.call(this,
		id,options.tagName,options);	
	if (options.onClose){
		this.setOnClose(options.onClose);
	}
	if (options.titleControl){
		this.setTitle(options.titleControl);
	}
	else if (options.title){
		this.setTitle(new Control(this.getId()+"_title","h1",{"value":options.title}));
	}
	
	var self = this;
}
extend(ViewList,ControlContainer);

ViewList.prototype.DEF_TAG_NAME = 'div';
//
ViewList.prototype.setTitle = function(titleControl){
	this.m_titleControl = titleControl;
}
ViewList.prototype.getTitleControl = function(){
	return this.m_titleControl;
}

ViewList.prototype.getOnClose = function(){
	return this.m_onClose;
}
ViewList.prototype.setOnClose = function(onClose){
	this.m_onClose = onClose;
}
ViewList.prototype.toDOM = function(parent){
	ViewList.superclass.toDOM.call(this,parent);
	
}
ViewList.prototype.removeDOM = function(){	
	ViewList.superclass.removeDOM.call(this);
}