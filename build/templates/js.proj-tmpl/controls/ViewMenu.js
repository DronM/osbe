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
		
	this.m_menu = new ControlContainer("page_menu","ul",{"className":"mainMenu"});		
	this.addElement(this.m_menu);
	
	this.m_content = new Control("page_content","div",{"className":"panel"});
	this.addElement(this.m_content);
}
extend(ViewMenu,ViewList);

ViewMenu.prototype.addItem = function(options){
	var self = this;
	this.m_menu.addElement(new MenuItem({
		"id":options.id+"_menu",
		"caption":options.caption,
		"className":"menu_item",
		"onClickContext":this,
		"viewClassId":options.viewClassId,
		"onClick":function(viewClassId){		
			self.m_itemClose();
			self.m_itemView = new viewClassId(options.id,
			{"onClose":self.m_itemClose,
			"connect":new ServConnector(HOST_NAME),
			"winObj":self.m_winObj
			});	
			self.m_itemView.toDOM(self.m_content.m_node);
		}
		})
	);
}