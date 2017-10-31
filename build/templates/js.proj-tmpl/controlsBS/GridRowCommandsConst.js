/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
* @requires controls/ControlCintainer.js 
*/

/* constructor */
function GridRowCommandsConst(id,options){
	options = options || {};
	options.onClickDelete=null;
	GridRowCommandsConst.superclass.constructor.call(this,
		id,options);
}
extend(GridRowCommandsConst,GridRowCommands);