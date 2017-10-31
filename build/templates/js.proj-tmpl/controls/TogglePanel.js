/* Copyright (c) 2012 
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
function TogglePanel(id,options){
	options = options || {};
	
	TogglePanel.superclass.constructor.call(this,
		id,"div",options);		
	var self = this;	
	this.addElement(new Button(id+"_tog_btn",
		{onClick:function(event){
			event = EventHandler.fixMouseEvent(event);
			self.toggle.call(self,event.target);},
		image:{src:this.IMAGE_CLOSED}
	}));	
	this.addElement(new Control(id+"_l","span",
		{value:options.labelText}
	));	
	
	this.m_open = false;
	
	this.m_onOpen = options.onOpen;
	this.m_onClose = options.onClose;
	this.m_context = options.context;
}
extend(TogglePanel,ControlContainer);

TogglePanel.prototype.IMAGE_OPEN = "img/treeview/open.gif";
TogglePanel.prototype.IMAGE_CLOSED = "img/treeview/closed.gif";

TogglePanel.prototype.m_open;
TogglePanel.prototype.m_panelContainer;
TogglePanel.prototype.m_onOpen;
TogglePanel.prototype.m_onClose;
TogglePanel.prototype.m_context;

TogglePanel.prototype.toggle = function(imgNode){
	if (imgNode){
		var new_img;
		if (this.m_open){
			new_img = this.IMAGE_CLOSED;
			this.m_onClose.call(this.m_context);
		}
		else{
			new_img = this.IMAGE_OPEN;
			this.m_onOpen.call(this.m_context);
		}
		imgNode.src = new_img;
		this.m_open = !this.m_open;
	}
}