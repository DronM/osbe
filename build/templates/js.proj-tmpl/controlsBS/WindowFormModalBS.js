/* Copyright (c) 2015 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires common/functions.js
*/

/* constructor */
function WindowFormModalBS(id,options){
	options = options || {};	
	options.className = options.className||"modal fade";
	options.attrs = options.attrs||{};
	options.attrs.role = "dialog";
	
	WindowFormModalBS.superclass.constructor.call(this,id,"div",options);	
	
	this.m_dialog = new ControlContainer(id+"_dial","div",{className:"modal-dialog"});
	this.m_content = new ControlContainer(id+"_cont","div",{className:"modal-content"});
	
	this.m_header = new ControlContainer(id+"_head","div",{className:"modal-header"});
	this.m_header.addElement(new Control(id+"_close","button",{
		className:"close",
		attrs:{"data-dismiss":"modal","aria-label":"Close"}
	}));
	
	this.m_body = new ControlContainer(id+"_body","div",{className:"modal-body"});
	if (options.content){
		this.m_body.addElement(options.content);
	}
	
	this.m_footer = new ControlContainer(id+"_footer","div",{className:"modal-footer"});
	
	this.m_content.addElement(this.m_header);
	this.m_content.addElement(this.m_body);
	this.m_content.addElement(this.m_footer);
	
	this.m_dialog.addElement(this.m_content);
}
extend(WindowFormModalBS,ControlContainer);

WindowFormModalBS.prototype.toDOM = function(parent){	
	WindowFormModalBS.superclass.toDOM.call(this,parent);	
	
	this.m_dialog.toDOM(this.getNode());
	$(this.getNode()).modal({
		show:true,
		keyboard:true
	});	
}

WindowFormModalBS.prototype.removeDOM = function(){	
	$(this.getNode()).modal("hide");
	this.m_dialog.removeDOM();
	WindowFormModalBS.superclass.toDOM.call(this);			
}

WindowFormModalBS.prototype.open = function(){	
	this.toDOM(document.body);
}
WindowFormModalBS.prototype.close = function(){	
	this.removeDOM();
}
WindowFormModalBS.prototype.getContentParent = function(){
	return this.m_body.getNode();
}
WindowFormModalBS.prototype.setCaption = function(caption){}
WindowFormModalBS.prototype.setFocus = function(){}
