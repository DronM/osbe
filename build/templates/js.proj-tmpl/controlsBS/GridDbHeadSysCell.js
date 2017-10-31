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
function GridDbHeadSysCell(id,options){
	options = options || {};
	options.value = options.value||this.DEF_VALUE;
	options.attrs = options.attrs||{};
	options.attrs["class"] = options.attrs["class"]||this.DEF_CLASS;
	GridDbHeadSysCell.superclass.constructor.call(this,
		id,options);
}
extend(GridDbHeadSysCell,GridDbHeadCell);
GridDbHeadSysCell.prototype.DEF_VALUE="...";
GridDbHeadSysCell.prototype.DEF_CLASS="grid_sys_col";