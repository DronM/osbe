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
function GridDbConst(id,options){
	options = options || {};
	GridDbConst.superclass.constructor.call(this,
		id,options);	
		
	this.m_editViewClasses = options.editViewClasses;
}
extend(GridDbConst,GridDb);

GridDbConst.prototype.onEdit = function(rowId,keys){	
	if (this.m_editViewClasses[keys["id"]]){
		this.m_editViewClass = this.m_editViewClasses[keys["id"]];
	}	
	else{
		//default form
		this.m_editViewClass = ConstInline_View;
	}
	var nodes = {parent:null,replaced_node:null};
	this.prepareEdit(rowId,keys,nodes);
	
	this.m_editViewObj.readData(this.m_asyncEditRead);	
	this.m_editViewObj.m_replacedNode = nodes.replaced_node;
	this.m_editViewObj.toDOM(nodes.parent,nodes.replaced_node);
	
	/*
	var parent,replaced_node;
	if (this.getEditInline()){
		parent = this.getBody().m_node;
		replaced_node = nd(rowId);		
	}
	else{
		parent = this.m_parent;
		this.removeDOM();	
	}	
	
	var contr_id = this.getController().getId();
	var contr = new window[contr_id](this.getController().getServConnector());
	var pm = contr.getGetObject();	
	this.paramsToMethod(pm);	
	this.initEditViewObj(contr);
	
	for (var key_id in keys){
		this.m_editViewObj.setReadIdValue(key_id,keys[key_id]);
	}	
	this.m_editViewObj.readData(this.m_asyncEditRead);	
	this.m_editViewObj.m_replacedNode = replaced_node;
	this.m_editViewObj.toDOM(parent);
	*/
}
