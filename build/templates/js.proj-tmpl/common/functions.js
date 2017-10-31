/* Copyright (c) 2010 
	Andrey Mikhalevich, Katren ltd.
*/
/*
	Base functions
*/

function extend(Child, Parent) {
	var F = function() { };
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;
}
function nd(x,docum){
	if (docum==undefined){
		docum = window.document;
	}	
	return (x)? docum.getElementById(x):null;
}


function findPosX(obj) {
    var curleft = 0;
    if (obj.offsetParent) {
        while (1) {
            curleft+=obj.offsetLeft;
            if (!obj.offsetParent) {
                break;
            }
            obj=obj.offsetParent;
        }
    } else if (obj.x) {
        curleft+=obj.x;
    }
    return curleft;
}

function findPosY(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        while (1) {
            curtop+=obj.offsetTop;
            if (!obj.offsetParent) {
                break;
            }
            obj=obj.offsetParent;
        }
    } else if (obj.y) {
        curtop+=obj.y;
    }
    return curtop;
}

function findPos(obj) {		
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	return [curleft,curtop];
}

/* Code below taken from - http://www.evolt.org/article/document_body_doctype_switching_and_more/17/30655/
 * Modified 4/22/04 to work with Opera/Moz (by webmaster at subimage dot com)
 * Gets the full width/height because it's different for most browsers.
*/
function getViewportHeight() {
	if (window.innerHeight!=window.undefined) return window.innerHeight;
	if (document.compatMode=='CSS1Compat') return document.documentElement.clientHeight;
	if (document.body) return document.body.clientHeight; 

	return window.undefined; 
}
function getViewportWidth() {
	var offset = 17;
	var width = null;
	if (window.innerWidth!=window.undefined) return window.innerWidth; 
	if (document.compatMode=='CSS1Compat') return document.documentElement.clientWidth; 
	if (document.body) return document.body.clientWidth; 
}

//************************************************************************

function format(str,params){
	return str.replace("%s",params[0]);
}
function isEmpty(x,p){
	for(p in x)return!1;return!0;
};

function isIE(){
	return (navigator.appName=="Microsoft Internet Explorer");
}
function createRequestObject(){
	var request_o;
	if(isIE()){
		request_o = new ActiveXObject("Microsoft.XMLHTTP");
	}
	else{
		request_o = new XMLHttpRequest();
	}
	return request_o;
}

function clone(obj) {
	return $.extend(true, {}, obj);
}

function clone2(obj) {
      if (obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
        return obj;

      if (obj instanceof Date)
        var temp = new obj.constructor(); //or new Date(obj);
      else
        var temp = obj.constructor();

      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          obj['isActiveClone'] = null;
          temp[key] = clone(obj[key]);
          delete obj['isActiveClone'];
        }
      }

      return temp;
}

function uuid()
{
   var chars = '0123456789abcdef'.split('');

   var uuid = [], rnd = Math.random, r;
   uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
   uuid[14] = '4'; // version 4

   for (var i = 0; i < 36; i++)
   {
      if (!uuid[i])
      {
         r = 0 | rnd()*16;

         uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
      }
   }

   return uuid.join('');
}
function minToStr(min){
	var h = Math.floor(min/60);
	var m = min%60;
	h = ((h<10)? '0':'') + h;
	m = ((m<10)? '0':'') + m;
	return (h+':'+m);
}
/**
 * Converts the given data structure to a JSON string.
 * Argument: arr - The data structure that must be converted to JSON
 * Example: var json_string = array2json(['e', {pluribus: 'unum'}]);
 * 			var json = array2json({"success":"Sweet","failure":false,"empty_array":[],"numbers":[1,2,3],"info":{"name":"Binny","site":"http:\/\/www.openjs.com\/"}});
 * http://www.openjs.com/scripts/data/json_encode.php
 */
function array2json(arr) {
	return JSON.stringify(arr);
	/*
    var parts = [];
    var is_list = (Object.prototype.toString.apply(arr) === '[object Array]');

    for(var key in arr) {
    	var value = arr[key];
        if(typeof value == "object") { //Custom handling for arrays
            if(is_list) parts.push(array2json(value));
            else parts.push('"' + key + '":' + array2json(value));
            //else parts[key] = array2json(value);
            
        } else {
            var str = "";
            if(!is_list) str = '"' + key + '":';

            //Custom handling for multiple data types
            if(typeof value == "number") str += value; //Numbers
            else if(value === false) str += 'false'; //The booleans
            else if(value === true) str += 'true';
            else str += '"' + value + '"'; //All other things
            // :TODO: Is there any more datatype we should be in the lookout for? (Functions?)

            parts.push(str);
        }
    }
    var json = parts.join(",");
    
    if(is_list) return '[' + json + ']';//Return numerical JSON
    return '{' + json + '}';//Return associative JSON
*/    
}
function json2obj(json_string) {
	return JSON.parse(json_string);
	//return eval("(" + json_string + ")");
}
function toFloat(v){
	var r = parseFloat(v);
	return ((isNaN(r))? 0:r);
}
function toInt(v){
	var r = parseInt(v);
	return ((isNaN(r))? 0:r);
}
function selectedText(input){
	var startPos = input.selectionStart;
	var endPos = input.selectionEnd;
	var doc = document.selection;

	if(doc && doc.createRange().text.length != 0){
		return (doc.createRange().text);
	}
	else if (!doc && input.value.substring(startPos,endPos).length != 0){
		return (input.value.substring(startPos,endPos));
	}
}
function getBrowser(){ 
	var res = "unknown";
    if(navigator.userAgent.indexOf("Chrome") != -1 ){
        res = "chrome";
    }
    else if(navigator.userAgent.indexOf("Opera") != -1 ){
		res = "opera";
    }
    else if(navigator.userAgent.indexOf("Firefox") != -1 ){
		 res = "firefox";
    }
    else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )){ //IF IE > 10
	  res = "ie";
    }  
	return res;
}
function is_array(o){ 
	return (Object.prototype.toString.call(o) === '[object Array]' );
}
function get_bs_col(){
	return BS_COL;
}

function numberFormat( number, decimals, dec_point, thousands_sep ) {	// Format a number with grouped thousands
	// 
	// +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +	 bugfix by: Michael White (http://crestidg.com)

	var i, j, kw, kd, km;

	// input sanitation & defaults
	if( isNaN(decimals = Math.abs(decimals)) ){
		decimals = 2;
	}
	if( dec_point == undefined ){
		dec_point = ",";
	}
	if( thousands_sep == undefined ){
		thousands_sep = ".";
	}

	i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

	if( (j = i.length) > 3 ){
		j = j % 3;
	} else{
		j = 0;
	}

	km = (j ? i.substr(0, j) + thousands_sep : "");
	kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
	//kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
	kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");


	return km + kw + kd;
}

