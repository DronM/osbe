/* Copyright (c) 2016 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
/** Requirements
 * @requires 
 * @requires core/extend.js  
*/

/* constructor
@param string id
@param object options{

}
*/
function ViewInlineGridClientEdit(id,options){
	options = options || {};	
	
	options.tagName = options.tagName || this.DEF_TAG_NAME;
	this.m_tagName = options.tagName;	
	
	ViewInlineGridClientEdit.superclass.constructor.call(this,id,this.m_tagName,options);
	
	this.m_containerClassName = options.containerClassName||"input-group";
	
	if (options.onClose){		
		this.setOnClose(options.onClose);
	}		
	
	var self = this;
	var onOk = function(){
		var tr = self.writeData();
		if (self.m_lastWriteResult){
			self.getOnClose().call(self,1,tr);
		}
	}
	var onCancel = function(){
		if (self.getOnClose){
			self.getOnClose().call(self,0);
		}				
		
	}
	this.m_ctrlOk = new ButtonSmall(id+"btnOk",		
		{"onClick":onOk,
		"glyph":"glyphicon-ok",
		"attrs":{
			"title":"записать"}
		});
	this.m_ctrlCancel = new ButtonSmall(id+"btnCancel",
		{"onClick":onCancel,
		"glyph":"glyphicon-remove",
		"attrs":{
			"title":"отмена"}
		});
		
	this.m_ctrlContainer = new ControlContainer(null,(this.m_tagName=="tr")? "td":this.m_tagName);
	this.m_ctrlContainer.setElementById("ok",this.m_ctrlOk);
	this.m_ctrlContainer.setElementById("cancel",this.m_ctrlCancel);
	
}
extend(ViewInlineGridClientEdit,ControlContainer);

/* Constants */
ViewInlineGridClientEdit.prototype.DEF_TAG_NAME = "tr";

/* private members */

/* protected*/


/* public methods */
ViewInlineGridClientEdit.prototype.getOnClose = function(){
	return this.m_onClose;
}
ViewInlineGridClientEdit.prototype.setOnClose = function(onClose){
	this.m_onClose = onClose;
}

ViewInlineGridClientEdit.prototype.toDOM = function(parent,replacedNode){
	var elem;
	for (var elem_id in this.m_elements){
		elem = this.m_elements[elem_id];
		elem.setValid();
		elem.resetValue();
		elem.toDOM(this.m_node);
	}
	//sys column
	this.m_ctrlContainer.toDOM(this.m_node);
	
	if (replacedNode){
		parent.replaceChild(this.m_node,replacedNode);
	}
	else{
		var rows = parent.getElementsByTagName(this.m_node.nodeName);
		if (rows.length==0){
			parent.appendChild(this.m_node);
		}
		else{			
			parent.insertBefore(this.m_node,rows[0]);
		}
	}
	
}

ViewInlineGridClientEdit.prototype.removeDOM = function(){		
	this.m_ctrlContainer.removeDOM();
	ViewInlineGridClientEdit.superclass.removeDOM.call(this);
}

ViewInlineGridClientEdit.prototype.addDataControl = function(control,readBind,writeBind,options){
	var container = new ControlContainer(uuid(),"div",{
		className:this.m_containerClassName
	});	
	
	var container_td = new ControlContainer(uuid(),"td");	
	container_td.setVisible(control.getVisible());
	container_td.setEnabled(control.getEnabled());	
	//this.setElementById("cont"+control.getId(),container_td);
	container_td.addElement(container);
	
	container.addElement(control);
	
	this.addElement(container_td);
}

ViewInlineGridClientEdit.prototype.writeData = function(){
	this.m_lastWriteResult = true;
	
	var tr;
	if (!this.m_replacedNode){
		tr = document.createElement("tr");
		tr.setAttribute("id",uuid());
	}
	else{
		tr = this.m_replacedNode;
	}
	var ind = 0;
	var td;
	for (var elem_id in this.m_elements){
		try{
			var elem = this.m_elements[elem_id];
			elem.validate(elem.getValue());
			
			if (!this.m_replacedNode){
				td = document.createElement("td");
				tr.appendChild(td);
			}
			else{
				td = this.m_replacedNode.cells[ind];	
			}
			
			var val;
			if (elem.getFieldId){
				var f_id = elem.getFieldId();
			
			
				if (elem.m_node.options){
					val = elem.m_node.options[elem.m_node.selectedIndex].innerHTML;
				}
				else{
					val = this.m_elements[elem_id].getValue();
				}
				
				td.setAttribute(f_id,this.m_elements[elem_id].getFieldValue(f_id));		
			}			
			else{
				val = this.m_elements[elem_id].getValue();
			}
			td.innerHTML = val;
			
		}
		catch(e){
			this.m_lastWriteResult = false;
		}
			
		ind++;
	}
	
	return tr;
	
}
