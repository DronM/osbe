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
function MenuItem(options){
	options =  options || {};
	options.id=options.id||uuid();
	options.className = options.className || "";
	options.className+= (options.className=="")? "":" ";
	options.className+= "menuItem";
	var tagName = options.tagName || this.DEF_TAG_NAME;
	
	MenuItem.superclass.constructor.call(this,options.id,tagName,options);
	
	this.m_viewClassId = options.viewClassId;
	var href = new Control(options.id+"_a","a",{"value":options.caption});
	
	this.m_onClick = options.onClick;
	this.m_onClickContext = options.onClickContext;
	this.m_viewClassId = options.viewClassId;
	
	var self = this;
	EventHandler.addEvent(href.m_node,"click",function(){
		self.setActive();
		/*
		var sel=DOMHandler.getElementsByAttr(self.DEF_SELECTED_CLASS,self.m_node.parentNode,"class");
		if (sel.length){
			DOMHandler.removeClass(sel[0],self.DEF_SELECTED_CLASS);
		}
		DOMHandler.addClass(self.m_node,self.DEF_SELECTED_CLASS);
		*/
		self.m_onClick.call(self.m_onClickContext,self.m_viewClassId);
	},false);
	this.setElementById("a",href);
}
extend(MenuItem,ControlContainer);

MenuItem.prototype.DEF_TAG_NAME = "li";
MenuItem.prototype.DEF_SELECTED_CLASS="active";


MenuItem.prototype.setActive = function(){
	var sel=DOMHandler.getElementsByAttr(this.DEF_SELECTED_CLASS,this.m_node.parentNode,"class");
	if (sel.length){
		DOMHandler.removeClass(sel[0],this.DEF_SELECTED_CLASS);
	}
	DOMHandler.addClass(this.m_node,this.DEF_SELECTED_CLASS);
}

/*
MenuItem.prototype.toDOM = function(parent){
	MenuItem.superclass.toDOM.call(this,parent);	
	var self = this;
	this.m_popUpMenu = new PopUpMenu();
	this.m_popUpMenu.width = 200;
	this.m_popUpMenu.add({		
		onClick:function(){			
			window.open(HOST_NAME); 
			exit;
			var links = document.getElementsByTagName("link");
			var scripts = document.getElementsByTagName("script");
			var newWin=window.open("", "Popup", "width=300,height=200"); 
			newWin.m_viewClassId = self.m_viewClassId;
			str_html=
				'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'+
				'<html>'+
				'<head>'+
				'<meta http-equiv="content-type" content="text/html; charset=UTF-8">';
				for (var i=0;i<links.length;i++){
					str_html+='<link rel="stylesheet" href="'+
					links[i].getAttribute("href")+
					'" type="text/css"/>';
				}
				for (var i=0;i<scripts.length;i++){
					var src = scripts[i].getAttribute("src");
					if (src!=undefined){
						str_html+='<script src="'+
						scripts[i].getAttribute('src')+
						'"></script>';
					}
				}								
				str_html+=
				'</head>'+
				'<body>'+
				'<div id="content"></div>'+
				'<script>'+
				'var MainView = new m_viewClassId("MainView",'+
				'{"onClose":onViewClose,'+
				'"connect":Connect'+
				'});'+
				'MainView.toDOM();'+
				'</script>'+
				'</body></html>';		
			newWin.document.write(str_html);						
			
			//var par = nd("content",newWin.document);
			//alert(par);
		},
		caption:"Открыть в новом окне"
	});				
	this.m_popUpMenu.bind(this.m_node);	
}
*/
