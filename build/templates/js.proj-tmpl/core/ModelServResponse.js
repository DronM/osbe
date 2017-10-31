/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires common/functions.js
 * @requires core/ModelSingleRow.js
 * @requires core/Field.js 
 * @requires core/FieldInt.js  
*/

/* constructor */
function ModelServResponse(node){
	ModelServResponse.superclass.constructor.call(this,node);
}
extend(ModelServResponse,ModelSingleRow);

ModelServResponse.prototype.createFields = function(){
	this.m_rows = this.m_node.getElementsByTagName(this.ROW_TAG);
	this.m_rowCount = this.m_rows.length;
	if (this.m_rowCount){
		this.addField(new FieldInt("result"));
		this.addField(new Field("descr"));
	}
}
