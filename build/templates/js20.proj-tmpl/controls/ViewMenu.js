/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires controls/ViewList.js
*/

/* constructor */
function ViewMenu(id,options){
	options = options || {};
	options.title = options.title;
	ViewMenu.superclass.constructor.call(this,
		id,options);
	
	this.m_winObj = options.winObj;
	var self = this;
	
	this.m_itemView=null;
	this.m_itemClose = function(res){					
		if (self.m_itemView!=undefined){
			self.m_itemView.removeDOM();
			delete self.m_itemView;
		}
	};
		
	this.m_menu = new ControlContainer("page_menu","ul",{"className":"nav nav-tabs"});//nav-pills
	this.addElement(this.m_menu);
	
	this.m_content = new Control("page_content","div",{"className":"panel panel-default"});
	this.addElement(this.m_content);
}
extend(ViewMenu,ViewList);

ViewMenu.prototype.addItem = function(options){
	var self = this;
	this.m_menu.addElement(new MenuItem({
		"id":options.id+"_menu",
		"caption":options.caption,
		"attrs":{"role":"presentation"},
		"onClickContext":this,
		"viewClassId":options.viewClassId,
		"onClick":function(viewClassId){
			self.onClick(viewClassId,options.id,options.viewParams);
		}
		})
	);
}

ViewMenu.prototype.onClick = function(viewClassId,id,viewParams){
	this.m_itemClose();
	this.m_itemView = new viewClassId(id,{
		"onClose":this.m_itemClose,
		"connect":new ServConnector(HOST_NAME),
		"winObj":this.m_winObj,
		"viewParams":viewParams
	});	
	this.m_itemView.toDOM(this.m_content.m_node);

}
