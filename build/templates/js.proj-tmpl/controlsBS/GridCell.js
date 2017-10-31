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
function GridCell(id,options){
	options = options || {};
	var tag_name = options.tagName || this.DEF_TAG_NAME;
	GridCell.superclass.constructor.call(this,
		id,tag_name,options);

	if (options.accocImageArray){
		this.m_accocImageArray = options.accocImageArray;
	}
	if (options.colSpanArray){
		this.m_colSpanArray = options.colSpanArray;
	}
		
	if (options.controlContainer){
		this.m_controlContainer = options.controlContainer;
	}
				
	if (options.image){
		this.setImage(options.image);
	}
	if (options.colSpan){
		this.setColSpan(options.colSpan);
	}
	if (options.rowSpan){
		this.setRowSpan(options.rowSpan);
	}	
	
	if (options.value){
		this.setValue(options.value);
	}
	
}
extend(GridCell,ControlContainer);

/* constants */
GridCell.prototype.DEF_TAG_NAME = "td";

GridCell.prototype.setImage = function(image){
	this.m_image = image;
}
GridCell.prototype.setColSpan = function(colSpan){
	this.setAttr("colspan",colSpan);
}
GridCell.prototype.setRowSpan = function(rowSpan){
	this.setAttr("rowspan",rowSpan);
}

GridCell.prototype.setValue = function(value){
	if (this.m_accocImageArray
	&& this.m_accocImageArray[value]){
		this.setImage(new Control(null,"img",{
		attrs:{src:this.m_accocImageArray[value]}
		}));
		if (this.m_node.childNodes){
			this.m_node.childNodes[0].nodeValue = "";
		}		
	}
	else if (this.m_controlContainer){
		this.m_controlContainer.setValue(value);
	}
	else{
		GridCell.superclass.setValue.call(this,value);
	}
}

GridCell.prototype.toDOM = function(parent){
	GridCell.superclass.toDOM.call(this,parent);
	if (this.m_image){
		this.m_image.toDOM(this.m_node);
	}
	if (this.m_controlContainer){
		this.m_controlContainer.toDOM(this.m_node);
	}			
}
GridCell.prototype.removeDOM = function(){
	GridCell.superclass.removeDOM.call(this);
	if (this.m_controlContainer){
		this.m_controlContainer.removeDOM();
	}	
}
GridCell.prototype.setControlContainer = function(cont){
	this.m_controlContainer = cont;
}
