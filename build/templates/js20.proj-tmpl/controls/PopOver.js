/* Copyright (c) 2017 
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

function PopOver(id,options){
	options = options || {};	
	
	options.template = window.getApp().getTemplate("PopOver");
	
	/*
	DOES NOT WORK THIS WAY BECAUSE OF THE TEMPLATE!!!
	options.elements = [
		new Control(id+":title","div"),
		new ControlContainer(id+":content","div",{
		})
	];
	*/
	
	PopOver.superclass.constructor.call(this,id,"template",options);
	
	this.addElement(new Control(id+":title","div",{"value":options.caption}));
	this.addElement(new ControlContainer(id+":content","div",{elements:options.contentElements}));
	
	var self = this;
	
	this.m_evHide = function(event){
		event = EventHelper.fixMouseEvent(event);		
		
		if (event.pageX<self.m_posMinX || event.pageX>self.m_posMaxX
		|| event.pageY<self.m_posMinY || event.pageY>self.m_posMaxY){
			
			var el = event.target;
			var other_popover = false;
			el = el.parentNode;
			while(el){
				if (DOMHelper.hasClass(el,"popover") || DOMHelper.hasClass(el,"datepicker")){
					other_popover = true;
					break;
				}
				el = el.parentNode;
			}
			//console.log("ID="+self.getId()+" other_popover="+other_popover)
			
			//out of bounds
			if (!other_popover && self.getVisible()){
				self.setVisible(false);
				event.stopPropagation();					
			}
		}
	}
	
}
extend(PopOver,ControlContainer);

/* Constants */


/* private members */

/* protected*/


/* public methods */
PopOver.prototype.setPosition = function(e,fixToElement){
        var x, y;
        if (fixToElement){
		var rect = fixToElement.getBoundingClientRect();
		y = rect.top+$(fixToElement).outerHeight();
		x = rect.left; 
	}
	else{
		x = e.pageX;
		y = e.pageY;	
	}        
        
        /*        
        if (fixToElement){
		var rect = fixToElement.getBoundingClientRect();
		y = rect.top+$(fixToElement).outerHeight();
		x = rect.left; 
	}
	else{        
		if (window.opera) {
		    x = e.clientX;
		    y = e.clientY;
		} else if (document.all) {
		    x = document.body.scrollLeft + event.clientX;
		    y = document.body.scrollTop + event.clientY;
		} else if (document.layers || document.getElementById) {
		    x = e.pageX;
		    y = e.pageY;
		}
	}
	*/
	
	var n = this.getNode();
	n.style.display = "block";
	n.style.position = "absolute";
        n.style.top  = y + 'px';
        n.style.left = x + 'px';
}

PopOver.prototype.setVisible = function(v){
	PopOver.superclass.setVisible.call(this,v);
	if (v){
		this.addClick();
	}
	else{
		this.delClick();
	}
}

PopOver.prototype.addClick = function(){
	EventHelper.add(document,"click",this.m_evHide,true);
}

PopOver.prototype.delClick = function(){
	EventHelper.del(document,"click",this.m_evHide,true);
}

PopOver.prototype.toDOM = function(e,fixToElement){
	this.setPosition(e,fixToElement);
	PopOver.superclass.toDOM.call(this,document.body);
	
	var rect = this.m_node.getBoundingClientRect();
	this.m_posMinY = rect.top;
	this.m_posMaxY = rect.top + $(this.m_node).outerHeight();
	this.m_posMinX = rect.left;
	this.m_posMaxX = rect.left + $(this.m_node).outerWidth();	
	this.m_zIndex = parseInt($(this.m_node).css("z-index"),10);
	
	this.addClick();
}

PopOver.prototype.delDOM = function(){
	PopOver.superclass.delDOM.call(this);
	
	this.delClick();	
}
