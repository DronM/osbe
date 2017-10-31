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
function ModelSingleRow(node){
	ModelSingleRow.superclass.constructor.call(this,node);
}
extend(ModelSingleRow,Model);

ModelSingleRow.prototype.setActive = function(active){
	if (active){
		this.createFields();
		this.setFirstRow();
	}
	else{
		this.destructFields();
	}
	this.m_active = active;
}
ModelSingleRow.prototype.setNode = function(node){
	this.m_node = node;
	this.setActive(true);
}
