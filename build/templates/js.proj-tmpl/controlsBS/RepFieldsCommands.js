/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
* @requires controls/ControlContainer.js 
*/

/* constructor */
function RepFieldsCommands(id,options){
	options = options || {};
	
	options.noCopy = true;
	options.noPrint = true;
	options.noRefresh = true;
	RepFieldsCommands.superclass.constructor.call(this,
		id,options);
		
	var self = this;
	//up
	this.m_btnUp = new ButtonCtrl(null,
	{"glyph":"glyphicon-arrow-up",
	"onClick":function(){
		if (self.getEnabled()){
			self.m_clickContext.onUp();
		}
		},
	"attrs":{"title":"передвинуть строку вверх"}
	});	
	this.setElementById(id+"_up",this.m_btnUp);
	
	//down
	this.m_btnDown = new ButtonCtrl(null,
	{"glyph":"glyphicon-arrow-down",
	"onClick":function(){
		if (self.getEnabled()){
			self.m_clickContext.onDown();
		}
		},
	"attrs":{"title":"передвинуть строку вниз"}
	});	
	this.setElementById(id+"_down",this.m_btnDown);
}
extend(RepFieldsCommands,GridCommands);

RepFieldsCommands.prototype.commandsToPopUp = function(popUp){
	if (this.m_btnUp){
		popUp.addButton(this.m_btnUp);
	}
	
	if (this.m_btnDown){
		popUp.addButton(this.m_btnDown);
	}
}
