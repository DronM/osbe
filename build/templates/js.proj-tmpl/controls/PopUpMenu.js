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
    bind: function(element) {
        var self = this;
        if (!element) {
            element = document;
        } else if (typeof element == 'string') {
            element = document.getElementById(element);
        }
        this.target = element;
        this.target.oncontextmenu = function(e) {
            self.show.call(self, e);
            return false;
        };
        var listener = function() { self.hide.call(self) };
        EventHandler.addEvent(document, 'click', listener, true);
    },
	/*action
	onClick
	image
	caption
	*/
    add: function(action) {
        this.items.push(action);
    },
    addButton: function(btn) {
        this.items.push({
			caption:btn.getCaption(),
			image:btn.getImage(),
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
            this.element.style.display = '';
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
        var menu = document.createElement('div');
		menu.className = 'pop_up_menu';
        with (menu.style) {
            if (self.width)  width  = self.width  + 'px';
            if (self.height) height = self.height + 'px';
            border     = "1px solid gray";
            background = '#FFFFFF';
            color      = '#000000';
            position   = 'absolute';
            display    = 'block';
            padding    = '2px';
            cursor     = 'default';
        }
        for (var i = 0; i < items.length; i++) {
            var item;
            if (items[i] == PopUpMenu.SEPARATOR) {
                item = this.createSeparator();
            } else {
                item = this.createItem(items[i]);
            }
            menu.appendChild(item);
        }
        return menu;
    },
    createItem: function(item) {
        var self = this;
        var elem = document.createElement('div');
		elem.className = 'pop_up_menu_item';
		elem.style.verticalAlign='middle';
        elem.style.padding = '4px';
        var callback = item.onClick;
		//alert(self.target.id);
        EventHandler.addEvent(elem, 'click', function(_callback) {
            return function() {
                self.hide();
                _callback(self.target);
            };
        }(callback), true);
        EventHandler.addEvent(elem, 'mouseover', function(e) {
            elem.style.background = '#B6BDD2';
        }, true);
        EventHandler.addEvent(elem, 'mouseout', function(e) {
            elem.style.background = '#FFFFFF';
        }, true);
		if (item.image!=undefined){
			var img = createImgElement(item.image.src,
						item.image.alt,
						item.image.h,
						item.image.w
			);
			img.style.margin = '5px';
			img.style.border='1px';
			img.style.verticalAlign='middle';
			elem.appendChild(img);
		}
        elem.appendChild(document.createTextNode(item.caption));
		//item.toDOM(elem);
        return elem;
    },
    createSeparator: function() {
        var sep = document.createElement('div');
        with (sep.style) {
            borderTop = '1px dotted #CCCCCC';
            fontSize  = '0px';
            height    = '0px';
        }
        return sep;
    }
};
