/*
  PopUpMenu.js - simple JavaScript popup menu library.
  Copyright (C) 2009 Jiro Nishiguchi <jiro@cpan.org> All rights reserved.
  This is free software with ABSOLUTELY NO WARRANTY.
  You can redistribute it and/or modify it under the modified BSD license.
  Usage:
    var popup = new PopUpMenu();
    popup.add(menuText, function(target){ ... });
    popup.addSeparator();
    popup.bind('targetElement');
    popup.bind(); // target is document;
	ф
*/
var PopUpMenu = function() {
    this.init();
}
PopUpMenu.SEPARATOR = 'PopUpMenu.SEPARATOR';
PopUpMenu.current = null;
PopUpMenu.prototype = {
	/*
	m_listener: function(){
		this.hide.call(this);
	},
	*/
    init: function() {
        this.items  = [];
        this.width  = 0;
        this.height = 0;
    },
    setSize: function(width, height) {
        this.width  = width;
        this.height = height;
        if (this.element) {
            var self = this;
            with (this.element.style) {
                if (self.width)  width  = self.width  + 'px';
                if (self.height) height = self.height + 'px';
            }
        }
    },
	unbind: function(){
		var self = this;
		EventHandler.removeEvent(document,"click",function(){
			self.hide.call(self);},true);
	},
    bind: function(element) {
		if (!this.items.length){
			return;
		}
        var self = this;
        if (!element) {
            element = document;
        } else if (typeof element == 'string') {
            element = document.getElementById(element);
        }
        this.target = element;
		EventHandler.addEvent(this.target,"contextmenu",function(e) {
            self.show.call(self, e);
			e.preventDefault();
            return false;
        },true);
		/*
        this.target.oncontextmenu = function(e) {
            self.show.call(self, e);
            return false;
        };
		*/        
        EventHandler.addEvent(document,"click",function(){
			self.hide.call(self);},true);
    },
	/*action
	onClick
	image
	glyph
	caption
	*/
    add: function(action) {
        this.items.push(action);
    },
    addButton: function(btn) {
        this.items.push({
			caption:btn.getCaption()||btn.getAttr("title"),
			image:btn.getImage(),
			glyph:btn.getGlyph(),
			onClick:btn.getOnClick()
		}
		);
    },	
    addSeparator: function() {
        this.items.push(PopUpMenu.SEPARATOR);
    },
    setPos: function(e) {
        if (!this.element) return;
        if (!e) e = window.event;
        var x, y;
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
        this.element.style.top  = y + 'px';
        this.element.style.left = x + 'px';
    },
    show: function(e) {
        if (PopUpMenu.current && PopUpMenu.current != this) return;
        PopUpMenu.current = this;
        if (this.element) {
            this.setPos(e);
            this.element.style.display = "block";
        } else {
            this.element = this.createMenu(this.items);
            this.setPos(e);
            document.body.appendChild(this.element);
        }
    },
    hide: function() {
        PopUpMenu.current = null;
        if (this.element) this.element.style.display = 'none';
    },
    createMenu: function(items) {
        var self = this;
        var menu = document.createElement("div");
		menu.className = "popover";
		menu.setAttribute("role","tooltip");
		//panel pop_up_menu
		var menu_t = document.createElement("div");
		menu_t.className = "tooltip-arrow";
		var menu_cont = document.createElement("div");
		menu_cont.className = "popover-content";
		
        var menu_cont2 = document.createElement("ul");
		menu_cont2.className = "nav";
		
        with (menu.style) {
            if (self.width)  width  = self.width  + 'px';
            if (self.height) height = self.height + 'px';
            position   = 'absolute';
            display    = 'block';
        }
        for (var i = 0; i < items.length; i++) {
            var item;
            if (items[i] == PopUpMenu.SEPARATOR) {
                item = this.createSeparator();
            } else {
                item = this.createItem(items[i]);
            }
            menu_cont2.appendChild(item);
        }
		menu_cont.appendChild(menu_t);
		menu_cont.appendChild(menu_cont2);
		menu.appendChild(menu_cont);
        return menu;
    },
    createItem: function(item) {
        var self = this;
		var elem_cont = document.createElement("li");
		elem_cont.className = "nav-item";
		
        var elem = document.createElement("a");		
		elem.setAttribute("href","#");
		var cl = "nav-link";
		if (item.disabled){
			cl+=" disabled";
		}
		elem.className = cl;
		
        var callback = item.onClick;
        EventHandler.addEvent(elem, "click", function(_callback) {
            return function() {
                self.hide();
                _callback(self.target);
            };
        }(callback), true);
		if (item.image){
			var img = createImgElement(item.image.src,
						item.image.alt,
						item.image.h,
						item.image.w
			);
			elem.appendChild(img);
		}
		else if (item.glyph){
			var i = document.createElement("i");
			i.className="glyphicon "+item.glyph;
			elem.appendChild(i);
		}
        elem.appendChild(document.createTextNode(item.caption));
		elem_cont.appendChild(elem);
		
        return elem_cont;
    },
    createSeparator: function() {
        var sep = document.createElement("div");
        with (sep.style) {
            borderTop = '1px dotted #CCCCCC';
            fontSize  = '0px';
            height    = '0px';
        }
        return sep;
    }
};
