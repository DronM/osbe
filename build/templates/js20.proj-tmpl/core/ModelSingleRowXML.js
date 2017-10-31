/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	!!! DEPRICATED USE ModelObject INSTEAD !!!!
*/
//ф
/** Requirements
 * @requires core/extend.js
*/

/* constructor
@param string id,
@param object options{}
*/
function ModelSingleRowXML(id,options){
	ModelSingleRowXML.superclass.constructor.call(this,id,options);
}
extend(ModelSingleRowXML,ModelXML);

ModelSingleRowXML.prototype.setNode = function(node){
	this.m_node = node;
}
