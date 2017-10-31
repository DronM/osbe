/* Copyright (c) 2016 
	Andrey Mikhalevich, Katren ltd.
*/
/*
	class	
	CommonHelper
	
	Basic functions
*/
/**
*/

var CommonHelper = {

	format: function(str,params){
		if (!str)return "";
		var r = str;
		for (var i=0;i<params.length;i++){
			r= r.replace("%",params[i]);
		}
		return r;
	},
	
	numberFormat: function( number, decimals, dec_point, thousands_sep ) {	// Format a number with grouped thousands
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
	},
	byteForamt:function(size,precision){
		precision = (precision==undefined)? 2:precision;
		var i = Math.floor( Math.log(size) / Math.log(1024) );
		return ( size / Math.pow(1024, i) ).toFixed(precision) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
	},
	nd: function(x,docum){
		if (docum==undefined){
			docum = window.document;
		}	
		return (x)? docum.getElementById(x):null;
	},
	
	isIE: function(){
		return (navigator.appName=="Microsoft Internet Explorer");
	},
	getIEVersion: function () {
		return parseInt(navigator.userAgent.toLowerCase().split('msie')[1]);
	},	
	getBrowser: function (){ 
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
	},
	
	createXHR: function(){
		var xhr;
		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		}
		else{
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
		return xhr;
	},
	createCORS: function(){
		var xhr = new XMLHttpRequest();
		if ("withCredentials" in xhr) {
		    // Check if the XMLHttpRequest object has a "withCredentials" property.
		    // "withCredentials" only exists on XMLHTTPRequest2 objects.
		}
		else if (typeof XDomainRequest != "undefined") {
		    // Otherwise, check if XDomainRequest.
		    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
		    xhr = new XDomainRequest();
		}
		else {
			// Otherwise, CORS is not supported by the browser.
			xhr = null;
			throw new Error("CORS is not supported by the browser");

		}
		return xhr;
	},
	
	isEmpty:function(x,p){
		for(p in x)return!1;return!0;
	},
	
	isArray: function (o){ 
		if (Array.isArray){
			return Array.isArray(o);
		}
		else{
			return (Object.prototype.toString.call(o) === '[object Array]' );
		}
	},
	
	clone: function (obj) {
		var F = function () {};
	        F.prototype = obj;
        	return new F();		
	},

	uniqid: function (){
	   var chars = '0123456789abcdef'.split('');

	   var uuid = [], rnd = Math.random, r;
	   uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	   uuid[14] = '4'; // version 4

	   for (var i = 0; i < 36; i++){
		  if (!uuid[i]){
			 r = 0 | rnd()*16;

			 uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
		  }
	   }
	   return uuid.join('');
	},
	
	/**
	 * Converts the given data structure to a JSON string.
	 * Argument: arr - The data structure that must be converted to JSON
	 * Example: var json_string = array2json(['e', {pluribus: 'unum'}]);
	 * 			var json = array2json({"success":"Sweet","failure":false,"empty_array":[],"numbers":[1,2,3],"info":{"name":"Binny","site":"http:\/\/www.openjs.com\/"}});
	 * http://www.openjs.com/scripts/data/json_encode.php
	 */
	array2json: function (arr) {
		return JSON.stringify(arr);
		/*
		var parts = [];
		var is_list = (Object.prototype.toString.apply(arr) === '[object Array]');

		for(var key in arr) {
			var value = arr[key];
			if(typeof value == "object") { //Custom handling for arrays
				if(is_list) parts.push(this.array2json(value));
				else parts.push('"' + key + '":' + this.array2json(value));
				//else parts[key] = this.array2json(value);
				
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
	},
	
	json2obj: function (json_string) {
		return (json_string)? JSON.parse(json_string):json_string;
		//return eval("(" + json_string + ")");
	},
	
	serialize:function(o){
		return this.array2json(o);
	},
	unserialize:function(json_string){
		//return this.json2obj(json_string);
		//console.log("unserialize="+json_string)
		return (json_string)? JSON.parse(json_string,function(key,val){
			//console.log("Key="+key+" val="+CommonHelper.var_export(val));
			//return val;
			if (val && typeof val=="object" && val.RefType){
				return new RefType(val.RefType);
			}
			else{
				return val;
			}
		}):json_string;
	},
	
	findPosX: function (obj) {
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
	},

	findPosY: function(obj) {
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
	},
	
	//returns default locale decimal separator
	getDecimalSeparator: function() {
	    var n = 1.1;
	    n = n.toLocaleString().substring(1, 2);
	    return n;
	},
	
	
	/***
	 * Author: Maverick Chan
	 * Script: longString.js
	 **/	
	//usage:longString(function () {/* very long multyline string */})
	longString:function(funcWrapper) {
		//return funcWrapper.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
		var funcString = funcWrapper.toString();
		var funcDefinitionRe
		    = /^function\s*[a-zA-Z0-9_$]*\s*\(\s*\)\s*{\s*\/\*([\s\S]*)\*\/\s*}\s*$/g;

		var wantedString = funcString.replace(funcDefinitionRe, "$1").trim();
		return wantedString;		
	},
	
	merge:function(o1,o2){
		for (var id in o2){
			o1[id] = o2[id];
		}
	},
	getClassName:function(o){
	        return Object.prototype.toString.call(o).match(/^\[object\s(.*)\]$/)[1];
	},
	md5:function(s){
		return hex_md5(s);
	},

	inArray:function(v,ar){
		return $.inArray(v,ar);
	},
	var_export:function(o){
		var output = "";
		if (typeof(o)=="object"){			
			for (var property in o) {
			  output += property + ": " + o[property]+"; ";
			}	
		}
		else{
			output = (o)? o.toString():"<undefined>";
		}
		return output;	
	},
	log:function (msg) {
	    if (console && console.log) {
		console.log(CommonHelper.var_export(msg));
	    }
	}	
	
}
