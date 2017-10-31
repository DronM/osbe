/* Copyright (c) 2014 
	Andrey Mikhalevich, Katren ltd.
*/
//ф
/** Requirements
*/

/* constructor */
var WindowPrint = {
	show:function(options){
		options = options || {};
		var newWin = window.open(""); 
		if (newWin){			
			var print_and_close = ( (options.print==undefined) || (options.print!=undefined && options.print==true) );
			newWin.document.write(
				'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'+
				'<html>'+
				'<head>'+
				'<meta http-equiv="content-type" content="text/html; charset=UTF-8">'+
				'<link rel="stylesheet" href="css/print.css?'+uuid()+'" type="text/css" media="all">'+
				'<title>'+( (options.title!=undefined)? options.title:"Печать" )+'</title>'+
				'</head>'+
				'<body>'+options.content+
				'</body></html>'
			);
			newWin.document.close();
			var win_del = setInterval(check_state,10);
			function check_state(){
				if (newWin.document.readyState=="complete"){
					clearInterval(win_del);
					newWin.focus();
					if (print_and_close){
						newWin.print();
						newWin.close();
					}
				}
			}
		}
	}
}
