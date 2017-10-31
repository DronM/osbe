/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends Grid
 * @requires core/extend.js
 * @requires core/Grid.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {namespace} options
 * @param {string} options.className
 */
function GridEdit(id,options){
	options = options || {};	
	
	GridEdit.superclass.constructor.call(this,id,options);
}
extend(GridEdit,Grid);

/* Constants */


/* private members */
GridEdit.prototype.m_modified;

/* protected*/


/* public methods */
GridEdit.prototype.getIsRef = function(){
	return false;
}

GridEdit.prototype.getModified = function(){
	return this.m_modified;
}

GridEdit.prototype.isNull = function(){
	return (!this.m_model || this.m_model.getRowCount()==0);
}

GridEdit.prototype.reset = function(){	
	if (this.m_model){
		this.m_model.clear();		
	}
	this.m_modified = true;
}

GridEdit.prototype.setValue = function(v){
	if (this.m_model){
		this.m_model.setData(v);		
	}
}

GridEdit.prototype.getValue = function(){
	return this.m_model.getData();
}

GridEdit.prototype.setInitValue = function(v){
	this.setValue(v);
	this.m_modified = false;
}


