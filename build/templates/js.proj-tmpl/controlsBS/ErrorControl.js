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
		id+"_errors","div",{}
	);
	//"className":"alert"
}
extend(ErrorControl,Control);

/* constants */

ErrorControl.prototype.setValue = function(val){
	if (!val||val.trim()==""){
		DOMHandler.removeClass(this.getNode(),"alert alert-danger");
	}
	else{
		DOMHandler.addClass(this.getNode(),"alert alert-danger");
	}
	ControlContainer.superclass.setValue.call(this,val);
}