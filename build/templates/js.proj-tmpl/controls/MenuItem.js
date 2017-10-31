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
	var tagName = options.tagName || this.DEF_TAG_NAME;
	MenuItem.superclass.constructor.call(
		this,options.id,tagName,options);
	this.m_viewClassId = options.viewClassId;
	var href = new Control(options.id+"_a","a",{"value":options.caption});
	EventHandler.addEvent(href.m_node,"click",function(){
		options.onClick.call(options.onClickContext,options.viewClassId);
	},false);
	this.setElementById('a',href);
}
extend(MenuItem,ControlContainer);

MenuItem.prototype.DEF_TAG_NAME = 'li';

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
			/*
		onViewClose();
		MainView = new self.m_viewClassId("MainView",
		{"onClose":onViewClose,
		"connect":Connect
		});	
		MainView.toDOM();
			*/
		},
		caption:"Открыть в новом окне"
	});				
	this.m_popUpMenu.bind(this.m_node);	
}