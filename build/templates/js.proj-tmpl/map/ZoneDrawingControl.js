/* Copyright (c) 2012 
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
function ZoneDrawingControl(id,options){
	ZoneDrawingControl.superclass.constructor.call(this,id,options);	
	/*
	this.addElement(new Button(id+"_zone_bigger",{
	"caption":"+"
	}));
	this.addElement(new Button(id+"_zone_smaller",{
	"caption":"-"
	}));
	*/
}
extend(ZoneDrawingControl,DrawingControl);

ZoneDrawingControl.prototype.DEL_CAPTION = "Удалить зону";
ZoneDrawingControl.prototype.DRAG_CAPTION = "Перетащить зону";
ZoneDrawingControl.prototype.DRAW_CAPTION = "Рисовать зону";
ZoneDrawingControl.prototype.MAVE_CAPTION = "Перемещать карту";
