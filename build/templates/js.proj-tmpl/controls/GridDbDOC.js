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
function GridDbDOC(id,options){
	options = options || {};
	GridDbDOC.superclass.constructor.call(this,
		id,options);	
}
extend(GridDbDOC,GridDb);

GridDbDOC.prototype.DEF_TITLE = "Документ";

GridDbDOC.prototype.onInsert = function(){	
	//GridDbDOC.superclass.onInsert.call(this);
	if (this.m_editViewObj){
		return 0;
	}
	
	this.setGlobalWait(true);
	
	var contr_id = this.getController().getId();
	var contr = new window[contr_id](this.getController().getServConnector());
	var pm = contr.getInsert();
	this.paramsToMethod(pm);
	
	this.initEditViewObj(contr);
	var parent;
	if (this.getEditInline()){
		parent = this.getBody().m_node;
	}
	else if (this.m_editWinClass){	
		//external window
		var self = this;
		this.m_editWin = new this.m_editWinClass(
		{"onBeforeClose":this.getBeforeExtWinClose(),
		"title":this.m_editViewObj.getFormCaption()+":Новый",
		"width":this.m_editViewObj.getFormWidth(),
		"height":this.m_editViewObj.getFormHeight()		
		});
		this.m_editWin.open();
		this.m_editViewObj.setWinObj(this.m_editWin);
		parent = this.m_editWin.getContentParent();
	}	
	else{
		parent = this.m_parent;
		this.removeDOM();	
	}

	//before insert
	if (this.m_editViewObj.m_beforeOpen){		
		var contr = new window[this.getController().getId()](new ServConnector(HOST_NAME));	
		this.m_editViewObj.m_beforeOpen(contr,true);
	}		
	
	this.m_editViewObj.toDOM(parent);
	this.setDefFilterValues();		
	
	this.setGlobalWait(false);
}
GridDbDOC.prototype.onEdit = function(rowId,keys,isCopy){	
	if (this.m_editViewObj){
		return 0;
	}
	
	this.setGlobalWait(true);
	
	var contr_id = this.getController().getId();
	var contr = new window[contr_id](this.getController().getServConnector());
	var pm = contr.getGetObject();	
	this.paramsToMethod(pm);	
	this.initEditViewObj(contr);
	
	var parent,replaced_node;
	if (this.getEditInline()){
		parent = this.getBody().m_node;
		replaced_node = nd(rowId);		
	}
	else if (this.m_editWinClass){	
		//external window
		var self = this;
		this.m_editWin = new this.m_editWinClass(
		{"onBeforeClose":this.getBeforeExtWinClose(),
		"title":this.m_editViewObj.getFormCaption()+":Редактирование",
		"width":this.m_editViewObj.getFormWidth(),
		"height":this.m_editViewObj.getFormHeight()				
		});
		this.m_editWin.open();
		parent = this.m_editWin.getContentParent();
	}		
	else{
		parent = this.m_parent;
		this.removeDOM();	
	}	
	
	for (var key_id in keys){
		this.m_editViewObj.setReadIdValue(key_id,keys[key_id]);
	}	
	
	this.m_editViewObj.readData(this.m_asyncEditRead);	
	if (this.m_editViewObj.m_beforeOpen){		
		this.m_editViewObj.m_beforeOpen(contr,false,isCopy);
	}			
	this.m_editViewObj.m_replacedNode = replaced_node;
	this.m_editViewObj.toDOM(parent);
	this.setGlobalWait(false);
}
GridDbDOC.prototype.onCopy = function(rowId,keys){	
	this.onEdit(rowId,keys,true);
}