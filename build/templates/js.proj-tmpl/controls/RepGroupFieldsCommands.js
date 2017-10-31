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
function RepGroupFieldsCommands(id,options){
	options = options || {};
	
	options.noInsert = true;
	options.noEdit = true;
	options.noDelete = true;
	options.noPrint = true;
	options.noRefresh = true;
	RepGroupFieldsCommands.superclass.constructor.call(this,
		id,options);
		
	var self = this;
	//up
	this.setElementById(id+"_up",new Button(null,
	{"image":{"src":this.IMG_UP},
	"onClick":function(){
		if (self.getEnabled()){
			self.m_clickContext.onUp();
		}
		},
	"attrs":{"title":"поднять группировку"}
	})
	);
	//down
	this.setElementById(id+"_down",new Button(null,
	{"image":{"src":this.IMG_DOWN},
	"onClick":function(){
		if (self.getEnabled()){
			self.m_clickContext.onDown();
		}
		},
	"attrs":{"title":"опустить группировку"}
	})
	);
}
extend(RepGroupFieldsCommands,GridCommands);

RepGroupFieldsCommands.prototype.IMG_UP = "img/groupper/pointer_up.ico";
RepGroupFieldsCommands.prototype.IMG_DOWN = "img/groupper/pointer_down.ico";