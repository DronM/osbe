/* Copyright (c) 2014 
	Andrey Mikhalevich, Katren ltd.
*/
//ф
/** Requirements
*/

/* constructor */
var WindowMessage = {
	TP_ER:0,
	TP_WARN:1,
	TP_NOTE:2,
	TP_MESSAGE:3,
	show:function(options){
		options = options || {};
		if (options.callBack){
			//новое окно
			alert(options.text);
			options.callBack();
		}
		else{
			alert(options.text);
		}
		/*
	   var f = new WindowFormModalDD({
		"content":"<div>"+options.text+"</div>"}
		);
	   f.open();
		*/
	}
}