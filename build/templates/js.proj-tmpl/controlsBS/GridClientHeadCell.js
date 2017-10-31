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
function GridClientHeadCell(id,options){
	options = options || {};	
	
	this.m_primaryKey = options.primaryKey;
	
	GridClientHeadCell.superclass.constructor.call(this);
}
extend(GridClientHeadCell,GridCell);

/* Constants */


/* private members */

/* protected*/


/* public methods */

