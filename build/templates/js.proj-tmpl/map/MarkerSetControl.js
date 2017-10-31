/* Copyright (c) 2014 
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
function MarkerSetControl(id,options){
	MarkerSetControl.superclass.constructor.call(this,id,options);	
}
extend(MarkerSetControl,DrawingControl);

MarkerSetControl.prototype.DEL_CAPTION = "Удалить маркер";
MarkerSetControl.prototype.DRAG_CAPTION = "Перетащить маркер";
MarkerSetControl.prototype.DRAW_CAPTION = "Установить маркер";
MarkerSetControl.prototype.MAVE_CAPTION = "Перемещать карту";
