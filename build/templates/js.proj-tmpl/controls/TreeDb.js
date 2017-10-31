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
function TreeDb(id,options){
	options = options || {};
	
	TreeDb.superclass.constructor.call(this,
		id,options);		
		
	if (options.controller){
		this.setController(options.controller);
	}
	if (options.readModelId){
		this.setReadModelId(options.readModelId);
	}
	if 	(options.methParams){
		this.m_methParams = options.methParams;
	}
	this.setReadMethodId(options.readMethodId || this.DEF_READ_METH_ID);
		
}
extend(TreeDb,Tree);

TreeDb.prototype.m_controller;
TreeDb.prototype.m_readModelId;
TreeDb.prototype.m_readMethodId;
TreeDb.prototype.m_methParams;

TreeDb.prototype.setController = function(controller){
	this.m_controller = controller;
}
TreeDb.prototype.getController = function(){
	return this.m_controller;
}

TreeDb.prototype.setReadMethodId = function(readMethodId){
	this.m_readMethodId = readMethodId;
}
TreeDb.prototype.getReadMethodId = function(){
	return this.m_readMethodId;
}

TreeDb.prototype.setReadModelId = function(readModelId){
	this.m_readModelId = readModelId;
}
TreeDb.prototype.getReadModelId = function(){
	return this.m_readModelId;
}
TreeDb.prototype.onRefresh = function(){
	var self = this;
	var pm;
	if (contr==undefined || meth==undefined){
		return;
	}		
	
	this.getController().run(this.getReadMethodId(),
		{async:true,
		func:this.onGetData,
		cont:this,
		err:this.onError,
		params:this.m_methParams
		});	
}
TreeDb.prototype.onGetData = function(){
}