/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2012
 
 * @class
 * @classdesc Edit control clear value button

 * @extends ButtonCtrl 

 * @requires core/extend.js
 * @requires controls/ButtonCtrl.js     
  
 * @param {string} id - html tag id
 * @param {namespase} options
 * @param {Control} options.editControl
 */
function ButtonMakeSelection(id,options){
	options = options || {};
	
	options.glyph = options.glyph || "glyphicon-save-file";
	
	ButtonMakeSelection.superclass.constructor.call(this,id,options);
}
extend(ButtonMakeSelection,ButtonCmd);

