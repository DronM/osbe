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
function TabMenuItem(id,options){
	options =  options || {};
	options.className = options.className || this.DEF_CLASS_NAME;
	options.attrs=options.attrs||{};
	options.attrs.role="presentation";
	TabMenuItem.superclass.constructor.call(
		this,id,"li",options);
	
	var self = this;
	this.m_href = new Control(null,"a",{"value":options.caption});
	EventHandler.addEvent(this.m_href.m_node,"click",function(){
		self.onClick(self.m_href,options.onClick,options.onClickContext,options.viewClassId);
	},false);
	
	this.setElementById("a",this.m_href);
	if (options.defItem) {
		this.onClick(this.m_href,options.onClick,options.onClickContext,options.viewClassId);
	}
}
extend(TabMenuItem,ControlContainer);

TabMenuItem.prototype.DEF_CLASS_NAME = "tabMenuItem";
TabMenuItem.prototype.DEF_SELECTED_CLASS="active";

TabMenuItem.prototype.onClick = function(href,onClick,onClickContext,viewClassId){
	var sel=DOMHandler.getElementsByAttr(this.DEF_SELECTED_CLASS,this.m_node.parentNode,"class");
	if (sel.length){
		DOMHandler.removeClass(sel[0],this.DEF_SELECTED_CLASS);
	}
	DOMHandler.addClass(this.m_node,this.DEF_SELECTED_CLASS);
	onClick.call(onClickContext,viewClassId);
}