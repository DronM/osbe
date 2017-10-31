/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc button for editting

 * @extends ButtonCtrl 

 * @requires core/extend.js
 * @requires controls/ButtonCtrl.js     
  
 * @param {string} id - html tag id
 * @param {namespase} options
 */
function ButtonOpen(id,options){
	options = options || {};
	
	options.glyph = "glyphicon-pencil";
	
	ButtonOpen.superclass.constructor.call(this,id,options);
}
extend(ButtonOpen,ButtonEditCtrl);

