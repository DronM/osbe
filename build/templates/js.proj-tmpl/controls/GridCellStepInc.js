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
function GridCellStepInc(id,options){
	options = options || {};
	GridCellStepInc.superclass.constructor.call(this,
		id,options);
		
	var self = this;
	this.m_step = options.step || this.DEFAULT_STEP;
	this.m_onClickInc = options.onClickInc;
	this.m_onClickDec = options.onClickDec;
	
	this.m_incControl = new ControlContainer(id+"_step_inc","div",{"className":"btns_cont"});
	this.m_incControl.addElement(new Button(id+"_step_inc_inc",{caption:"+",
	onClick:function(ev){
		if (self.m_onClickInc){
			self.m_onClickInc(self,EventHandler.fixMouseEvent(ev));
		}
		else{
			self.setValue(parseFloat(self.getValue())+self.m_step);
		}
	}}));
	this.m_incControl.addElement(new Button(id+"_step_inc_dec",{caption:"-",
	onClick:function(ev){
		if (self.m_onClickDec){
			self.m_onClickDec(self,EventHandler.fixMouseEvent(ev));
		}
		else{
			self.setValue(parseFloat(self.getValue())-self.m_step);
		}
	}}));
}
extend(GridCellStepInc,GridCell);

GridCellStepInc.prototype.DEFAULT_STEP = 1;

GridCellStepInc.prototype.toDOM = function(parent){
	GridCellStepInc.superclass.toDOM.call(this,parent);
	this.m_incControl.toDOM(this.m_node);
}
GridCellStepInc.prototype.removeDOM = function(){
	this.m_incControl.removeDOM(this.m_node);
	GridCellStepInc.superclass.removeDOM.call(this);	
}

GridCellStepInc.prototype.setValue = function(value){
	if (!this.m_incControl){
		GridCellStepInc.superclass.setValue.call(this,value);		
	}
	else{
		this.m_node.removeChild(this.m_node.firstChild);
		this.m_node.insertBefore(document.createTextNode(value),
			this.m_incControl.m_node);
	}
}
