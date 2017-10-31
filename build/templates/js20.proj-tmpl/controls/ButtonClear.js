/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc Edit control clear value button

 * @extends ButtonCtrl 

 * @requires core/extend.js
 * @requires controls/ButtonCtrl.js     
  
 * @param {string} id - html tag id
 * @param {namespase} options
 * @param {Control} options.editControl
 */
function ButtonClear(id,options){
	options = options || {};
	options.glyph = "glyphicon-remove";
	
	var self = this;
	
	options.onClick = options.onClick || 
		function(event){
			self.getEditControl().reset();	
		};
			
	ButtonClear.superclass.constructor.call(this,id,options);
}
extend(ButtonClear,ButtonCtrl);
