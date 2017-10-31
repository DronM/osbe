
$import("String.js");$import("Firefox.attachEvent.js");function InitializeTrimBox(ctrl)
{if(ctrl!=null)
{var obj=typeof(ctrl)=="string"?document.getElementById(ctrl):ctrl;if(obj==null)
{alert("Error:ctrl {"+ctrl+"} does not exist!");return false;}
__TrimBoxAddEventHandler(obj);return true;}
var aryObject=document.getElementsByTagName("input");for(var i=0;i<aryObject.length;i++)
{var obj=aryObject[i];__TrimBoxAddEventHandler(obj);}
return true;}
function __TrimBoxAddEventHandler(obj)
{if(obj.type!="text")
return;obj.attachEvent('onchange',(function(p)
{return function()
{p.value=p.value.trim();};})(obj));}