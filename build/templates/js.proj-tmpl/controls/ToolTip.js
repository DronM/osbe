/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements 
 * @requires common/EventHandler.js
*/
/* constructor */
function ToolTip(options){
	this.m_onHover = options.onHover;
	this.m_node = options.node;
	
	var self = this;
	this.m_wait = options.wait || this.DEF_WAIT;

	this.m_evMouseOver = function(event){		
		event = EventHandler.fixMouseEvent(event);
		self.m_timeout = setTimeout(
		function(){
			self.m_out = false;
			self.m_onHover(event);
		},self.m_wait);
	};
	
	this.m_evMouseOut = function(event){
		self.m_out = true;
		if (self.m_timeout){
			clearTimeout(self.m_timeout);
			self.m_timeout = null;		
		}
		self.remove();			
	}

	this.addEvent();	
}

ToolTip.prototype.DEF_WAIT = 3000;

ToolTip.prototype.popup = function(content,options){
	options = options||{};
	this.m_active = true;	
	tooltip.show(content,options.width);
	if (this.m_out){
		this.remove();
	}
}

ToolTip.prototype.remove = function(){	
	tooltip.hide();
	this.m_active = false;
}
ToolTip.prototype.getWait = function(){	
	return this.m_wait;
}
ToolTip.prototype.setWait = function(wait){	
	this.m_wait = wait;
	this.removeEvent();	
	if (wait>0){
		this.addEvent();	
	}
}
ToolTip.prototype.addEvent = function(){	
	EventHandler.addEvent(this.m_node,"mouseover",
		this.m_evMouseOver,false);
	EventHandler.addEvent(this.m_node,"mouseout",
		this.m_evMouseOut,false);		
}
ToolTip.prototype.removeEvent = function(){	
	EventHandler.removeEvent(this.m_node,"mouseover",
		this.m_evMouseOver,false);
	EventHandler.removeEvent(this.m_node,"mouseout",
		this.m_evMouseOut,false);		
}

var tooltip=function(){
	var id = 'tt';
	var top = 3;
	var left = 3;
	var maxw = 300;
	var speed = 10;
	var timer = 20;
	var endalpha = 95;
	var alpha = 0;
	var tt,t,c,b,h;
	var ie = document.all ? true : false;
	return{
		show:function(v,w){			
			if(tt == null){
				tt = document.createElement('div');
				tt.setAttribute('id',id);
				t = document.createElement('div');
				t.setAttribute('id',id + 'top');
				c = document.createElement('div');
				c.setAttribute('id',id + 'cont');
				b = document.createElement('div');
				b.setAttribute('id',id + 'bot');
				tt.appendChild(t);
				tt.appendChild(c);
				tt.appendChild(b);
				document.body.appendChild(tt);
				tt.style.opacity = 0;
				tt.style.filter = 'alpha(opacity=0)';				
			}
			document.onmousemove = this.pos;
			tt.style.display = 'block';
			c.innerHTML = v;
			tt.style.width = w ? w + 'px' : 'auto';
			if(!w && ie){
				t.style.display = 'none';
				b.style.display = 'none';
				tt.style.width = tt.offsetWidth;
				t.style.display = 'block';
				b.style.display = 'block';
			}
			if(tt.offsetWidth > maxw){tt.style.width = maxw + 'px'}
			h = parseInt(tt.offsetHeight) + top;
			clearInterval(tt.timer);
			tt.timer = setInterval(function(){tooltip.fade(1)},timer);
		},
		pos:function(e){
			var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
			var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
			//console.log("y="+u+" x="+l);
			tt.style.top = (u - h) + 'px';
			tt.style.left = (l + left) + 'px';
		},
		fade:function(d){
			if (!tt){
				return;
			}
			var a = alpha;
			if((a != endalpha && d == 1) || (a != 0 && d == -1)){
				var i = speed;
				if(endalpha - a < speed && d == 1){
					i = endalpha - a;
				}else if(alpha < speed && d == -1){
					i = a;
				}
				alpha = a + (i * d);
				tt.style.opacity = alpha * .01;
				tt.style.filter = 'alpha(opacity=' + alpha + ')';
			}else{
				clearInterval(tt.timer);
				if(d == -1){tt.style.display = 'none'}
			}
		},
		hide:function(){
			if (tt){
				clearInterval(tt.timer);
				tt.timer = setInterval(function(){tooltip.fade(-1)},timer);
			}
		}
	};
}();
