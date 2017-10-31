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
function GridFootCell(id,options){
	options = options || {};
	GridFootCell.superclass.constructor.call(this,
		id,options);
	if (options.calc){
		this.calc = options.calc;
	}
	if (options.calcBegin){
		this.calcBegin = options.calcBegin;
	}
	if (options.calcEnd){
		this.calcEnd = options.calcEnd;
	}
	
}
extend(GridFootCell,GridCell);