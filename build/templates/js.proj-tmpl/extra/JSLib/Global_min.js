
var LIBRARY_PATH="js/JSLib/";if(document.all)
document.attachEvent("onkeydown",__OnKeyPressed);else
document.addEventListener("keydown",__OnKeyPressed,false);function __OnKeyPressed(evt)
{if(evt.keyCode==68&&evt.altKey)
{window.open(LIBRARY_PATH+"ObjectBrowser.htm").title="opener.document";}}
function ShowObjectDetail(obj)
{var wnd=window.open(LIBRARY_PATH+"ObjectBrowser.htm");wnd.ExpandObject(obj,"divContent");}
function $import(path)
{var s,i;var ss=document.getElementsByTagName("script");for(var i=0;i<ss.length;i++)
{if(ss[i].src&&ss[i].src.indexOf(path)>0||ss[i].src&&ss[i].src.indexOf(GetAbsoluteUrl(LIBRARY_PATH+path))>0)
{return;}}
s=document.createElement("script");s.type="text/javascript";s.src=LIBRARY_PATH+path;var head=document.getElementsByTagName("head")[0];head.appendChild(s);}
function GetAbsoluteUrl(path)
{var img=new Image();img.src=path;return img.src;}
function GetUrlParameter(strName)
{var url=location.search.substring(1);var tempStr=strName+"=";if(url.indexOf(tempStr)==-1)
return null;if(url.indexOf("&")!=-1)
{var a=url.split("&");var i=0;for(i=0;i<a.length;i++)
{if(a[i].indexOf(tempStr)!=-1)
return a[i].substring(tempStr.length);}}
else
{return url.substring(tempStr.length);}}