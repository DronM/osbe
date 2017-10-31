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
function DrawingControl(id,options){
	options = options || {};
	this.m_onNavigate = options.onNavigate;
	this.m_onDraw = options.onDraw;
	this.m_onDrag = options.onDrag;
	this.m_onDelete = options.onDelete;
	
	DrawingControl.superclass.constructor.call(this,id,"div");	
	
	this.m_group = new EditRadioGroup(id+"_control_group");
	
	this.addMoveControl();
	this.addDrawControl();
	this.addDragControl();
	this.addDeleteControl();
	this.addElement(this.m_group);
}
extend(DrawingControl,ControlContainer);

DrawingControl.prototype.DEL_CAPTION = "Удалить";
DrawingControl.prototype.DRAG_CAPTION = "Перетащить";
DrawingControl.prototype.DRAW_CAPTION = "Рисовать";
DrawingControl.prototype.MAVE_CAPTION = "Перемещать карту";

DrawingControl.prototype.addMoveControl = function(){
	var self = this;
	var id = this.getId();
	var ctrl = new EditRadio(id+"_navigate",
		{"descr":this.MAVE_CAPTION,
		"name":"map_contr",
		"contClassName":"form-group "+get_bs_col()+"3",
		"attrs":{"checked":"checked","id":id+"_navigate"},
		"events":{
			"click":function(){
				self.m_onNavigate();
			}
		}
		}
	);
	this.m_group.addElement(ctrl);
}
DrawingControl.prototype.addDragControl = function(){
	var self = this;
	var id = this.getId();
	var ctrl = new EditRadio(id+"_drag",
	{"descr":this.DRAG_CAPTION,
	"name":"map_contr",
	"contClassName":"form-group "+get_bs_col()+"3",
	"attrs":{"id":id+"_drag"},
	"events":{
			"click":function(){
				self.m_onDrag();
			}
		}
	});
	this.m_group.addElement(ctrl);
}
DrawingControl.prototype.addDrawControl = function(){
	var self = this;
	var id = this.getId();
	var ctrl = new EditRadio(id+"_draw",
	{"descr":this.DRAW_CAPTION,
	"name":"map_contr",
	"contClassName":"form-group "+get_bs_col()+"3",
	"attrs":{"id":id+"_draw"},
		"events":{
			"click":function(){
				self.m_onDraw();
			}
		}
	});
	this.m_group.addElement(ctrl);
}
DrawingControl.prototype.addDeleteControl = function(){
	var self = this;
	var id = this.getId();
	var ctrl = new Button(id+"_zone_delete",{
		"onClick":function(){
			self.m_onDelete();
		},
		"className":"btn btn-default "+get_bs_col()+"3",
		"caption":this.DEL_CAPTION}
	);
	this.m_group.addElement(ctrl);
}