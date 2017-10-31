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
		var newWin=window.open(""); 
		if (newWin){
			var title=(options.title!=undefined)? options.title:'Печать';
			newWin.document.write(
				'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'+
				'<html>'+
				'<head>'+
				'<meta http-equiv="content-type" content="text/html; charset=UTF-8">'+
				'<link rel="stylesheet" href="css/print.css?'+uuid()+'" type="text/css" media="all">'+
				'<title>'+title+'</title>'+
				'</head>'+options.content+
				'<body>'+
				'</body></html>'
				);
			/*
			if (options.print==undefined||(options.print!=undefined&&options.print==true)
				){				
				if (getBrowser()!="chrome"&&newWin.print!=undefined){
					newWin.print();
					if (options.close==undefined||(options.close!=undefined&&options.close==true)
						){
						newWin.close();													
					}
				}
			}
			*/
			var nav = navigator.userAgent.toLowerCase();
			if (nav.indexOf('chrome') > -1){
				var showPopup = false;
				newWin.onbeforeunload = function () {
					if (showPopup) {
						return 'You must use the Cancel button to close the Print Preview window.\n';
					} else {
						showPopup = true;
					}
				}
			}
			else if (nav.indexOf('msi') > -1){				
				if (options.print==undefined||(options.print!=undefined&&options.print==true)){
					newWin.print();
				}				
			}
			else {
				newWin.document.close();
				newWin.focus();
				if (options.print==undefined||(options.print!=undefined&&options.print==true)){
					newWin.print();
					newWin.close();
				}
			}			
			
		}
	}
}