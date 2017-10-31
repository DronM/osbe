/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements 
 * @requires common/DOMHandler.js
*/
/* constructor */
function ErrorControl(id){
	ErrorControl.superclass.constructor.call(this,
		id+"_errors","div",{"className":"error"}
	);
}
extend(ErrorControl,Control);

/* constants */