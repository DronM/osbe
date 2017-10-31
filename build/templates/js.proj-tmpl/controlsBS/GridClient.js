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
function GridClient(id,options){
	options = options || {};	
	
	options.editInline = true;
	options.refreshInterval = 0;
	options.editViewClass = ViewInlineGridClientEdit;
	this.m_editControls = options.editControls;
		
	GridClient.superclass.constructor.call(this,id,options);
}
extend(GridClient,Grid);

/* Constants */


/* private members */

/* protected*/
GridClient.prototype.onError = function(erStr){		
	if (this.m_errorControl){
		this.m_errorControl.setValue(erStr);
	}
	else{
		alert("AJAX error: "+erStr);
	}
}

GridClient.prototype.initEditViewObj = function(){	
	var self = this;
	
	this.m_editViewObj = new this.m_editViewClass(
		this.getId()+"EditView",
		{"elements":this.m_editControls,
		"onClose":function(res,tr){									
			if (self.m_editViewObj.m_replacedNode){
				var n = self.m_editViewObj.getNode();
				var parent = n.parentNode;			
				parent.replaceChild(self.m_editViewObj.m_replacedNode, n);
			}
			else if (res){
				self.getBody().getNode().appendChild(tr);
				self.selectRow(tr,self.getSelectedNode());
			}
			
			self.m_editViewObj.removeDOM();
			delete self.m_editViewObj;
		},
		"errorControl":(this.m_editWinClass)? null:this.getErrorControl(),
		"winObj":(this.m_editWinClass)? self.m_editWin:this.m_winObj
		}
	);
}

GridClient.prototype.onInsert = function(){
	if (this.m_editViewObj){
		return 0;
	}
	
	this.initEditViewObj();
	var parent;
	if (this.getEditInline()){
		parent = this.getBody().m_node;
	}
	else if (this.m_editWinClass){	
		//external window
		this.m_editWin = new this.m_editWinClass(
		{
		"view":this.m_editViewObj,
		"title":this.m_editViewObj.getFormCaption()+":Новый",
		"width":this.m_editViewObj.getFormWidth(),
		"height":this.m_editViewObj.getFormHeight()
		}
		);
		this.m_editWin.open();
		this.m_editViewObj.setWinObj(this.m_editWin);
		parent = this.m_editWin.getContentParent();
	}
	else{
		parent = this.m_parent;
		this.removeDOM();	
	}
	
	this.m_editViewObj.toDOM(parent);
	
	GridClient.superclass.onInsert.call(this);	
}

GridClient.prototype.prepareEdit = function(rowId,keys,nodes,isCopy){	
	if (this.m_editViewObj){
		return 0;
	}
	
	//for (var key_id in keys){
	//	this.m_editViewObj.setReadIdValue(key_id,keys[key_id]);		
	//}	
	this.initEditViewObj();
	
	if (this.getEditInline()){
		nodes.parent = this.getBody().m_node;
		nodes.replaced_node = nd(rowId,this.getWinObjDocum());		
	}
	else if (this.m_editWinClass){	
		//external window
		this.m_editWin = new this.m_editWinClass(
		{
		"view":this.m_editViewObj,
		"title":this.m_editViewObj.getFormCaption()+((isCopy)? ":Новый":":Редактирование"),
		"width":this.m_editViewObj.getFormWidth(),
		"height":this.m_editViewObj.getFormHeight()		
		});
		this.m_editWin.open();
		nodes.parent = this.m_editWin.getContentParent();
	}	
	else{
		nodes.parent = this.m_parent;
		this.removeDOM();	
	}

}

GridClient.prototype.onEdit = function(rowId,keys){	
	var nodes = {parent:null,replaced_node:null};
	this.prepareEdit(rowId,keys,nodes);
		
	this.m_editViewObj.m_replacedNode = nodes.replaced_node;	
	this.m_editViewObj.toDOM(nodes.parent,nodes.replaced_node);

	var cell = this.m_editViewObj.m_replacedNode.cells[0];
	var f_id = this.m_editControls[0].getFieldId();
	this.m_editControls[0].setValue(cell.innerHTML);
	this.m_editControls[0].setFieldValue(f_id,cell.getAttribute(f_id));
	
}
