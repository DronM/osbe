/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>
 
 * @class
 * @classdesc Button for controls for inserting new element
 
 * @extends Control
  
 * @requires core/DOMHelper.js
 * @requires core/EventHelper.js
 * @requires controls/Control.js

 * @param {string} id Object identifier
 * @param {namespace} options  
*/
function ButtonInsert(id,options){
	options = options || {};
	
	options.glyph = "glyphicon-plus";
	
	var self = this;
	
	options.onClick = options.onClick || 
			function(event){
				self.doInsert(EventHelper.fixMouseEvent(event));
			};

	ButtonInsert.superclass.constructor.call(this,id,options);
}
extend(ButtonInsert,ButtonCtrl);

ButtonInsert.prototype.doInsert = function(e){
	console.log("ButtonInsert.prototype.openInsert");
}
