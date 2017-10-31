/* Copyright (c) 2010 
	Andrey Mikhalevich, Katren ltd.
*/
/*
	class	
	EventHandler
*/
//пп
/**
*/

var EventHandler = {
	addEvent:function(obj, evType, fn, capture){
		if (typeof obj == 'string') {
			obj = $(obj);
		}
		if (obj&&obj.addEventListener){
			obj.addEventListener(evType, fn, capture);
			return true;
		} else if (obj&&obj.attachEvent){
			var r = obj.attachEvent("on"+evType, fn);
			return r;
		} else {
			return false;
		}
	},
	removeEvent:function(obj, evType, fn, useCapture){
		//console.trace();
	  if (obj.removeEventListener){
		obj.removeEventListener(evType, fn, useCapture);
		return true;
	  } else if (obj.detachEvent){
		var r = obj.detachEvent("on"+evType, fn);
		return r;
	  } else {
		alert("Handler could not be removed");
	  }
	},
	/*
		Mouse Event fixing
	*/
	fixMouseEvent:function(e){
		e = e || window.event;
		if (e.target===undefined) {
			  e.target = e.srcElement;
		}
		// добавить pageX/pageY для IE
		if ( e.pageX == null && e.clientX != null ) {
			var html = document.documentElement;
			var body = document.body;
			e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
			e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
		}

		// добавить which для IE
		if (!e.which && e.button) {
			e.which = e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) );
		}
		
		return (e);
	},
	fixKeyEvent:function(e){
		e = e || window.event;
		if (e.target===undefined) {
			  e.target = e.srcElement;
		}
		e.keyCode = (e.charCode) ? e.charCode:e.keyCode;
		return (e);
	}
	
};
