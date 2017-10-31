/* Copyright (c) 2014 
	Andrey Mikhalevich, Katren ltd.
*/
//ф
/** Requirements
*/

/* constructor */
var WindowError = {
	TP_ER:0,
	TP_WARN:0,
	TP_NOTE:0,
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
	}
}