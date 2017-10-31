/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
* @requires controls/GridHeadCell.js 
*/

/* constructor */
function GridDbHeadCellBool(id,options){
	options = options || {};
	options.assocImageArray=options.assocImageArray||
		{"true":"img/bool/true.png",		
			"false":"img/bool/false.png"};
	options.colAttrs = options.colAttrs||
		{"align":"center"};
	
	GridDbHeadCellBool.superclass.constructor.call(this,
		id,options);	
}
extend(GridDbHeadCellBool,GridDbHeadCell);