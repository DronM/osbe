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
function GridAjxDOCT(id,options){
	options = options || {};	
	
	options.refreshAfterDelRow = true;
	options.refreshInterval = 0;
	
	GridAjxDOCT.superclass.constructor.call(this, id, options);
}
extend(GridAjxDOCT,GridAjx);

/* Constants */
GridAjxDOCT.prototype.m_modified;

/* private members */

/* protected*/
/* public methods */

GridAjxDOCT.prototype.afterServerDelRow = function(){
	this.setModified(true);
	GridAjxDOCT.superclass.afterServerDelRow.call(this);
}

GridAjxDOCT.prototype.refreshAfterEdit = function(res){
	
	GridAjxDOCT.superclass.refreshAfterEdit.call(this,res);
	if (res && res.updated){
		this.setModified(true);
	}
}

GridAjxDOCT.prototype.getModified = function(){
	return this.m_modified;
}
GridAjxDOCT.prototype.setModified = function(v){
	this.m_modified = v;
}
