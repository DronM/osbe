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
	TabMenuItem.superclass.constructor.call(
		this,id,"li",options);
	
	var self = this;
	this.m_href = new Control(null,"a",{"value":options.caption});
	EventHandler.addEvent(this.m_href.m_node,"click",function(){
		self.onClick(self.m_href,options.onClick,options.onClickContext,options.viewClassId);
	},false);
	this.setElementById('a',this.m_href);
	if (options.defItem) {
		this.onClick(this.m_href,options.onClick,options.onClickContext,options.viewClassId);
	}
}
extend(TabMenuItem,ControlContainer);
TabMenuItem.prototype.onClick = function(href,onClick,onClickContext,viewClassId){
	var par = href.m_node.parentNode;
	if (par){
		var sel=DOMHandler.getElementsByAttr("selected",par.parentNode,"class");
		if (sel.length){
			DOMHandler.removeClass(sel[0],"selected");
		}
	}
	DOMHandler.addClass(href.m_node,"selected");
	onClick.call(onClickContext,viewClassId);
}