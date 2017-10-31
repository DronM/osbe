/************************************************************
 * Javascript Lib V1.2
 * CONTACT: jerry.wang@clochase.com
 *
 * The Global.js should be included in the HTML before the others
 ************************************************************/

// This is the Javascript Library pach
var LIBRARY_PATH = "js/extra/JSLib/";

// ************ This secion is for debug only
if( document.all )
    document.attachEvent( "onkeydown", __OnKeyPressed);
else
    document.addEventListener( "keydown" , __OnKeyPressed, false);

function __OnKeyPressed(evt)
{
    // Alt + D
    if( evt.keyCode == 68 && evt.altKey )
    {
        window.open( LIBRARY_PATH + "ObjectBrowser.htm" ).title = "opener.document";
    }
}

function ShowObjectDetail(obj)
{
    var wnd = window.open( LIBRARY_PATH + "ObjectBrowser.htm" );
    wnd.ExpandObject( obj, "divContent");
}
// ************


//-------------------------------------------------------------------------
// Function Name    :$import
// Parameter(s)     :path       The js file name
// Memo             :To include another *.js in the HTML page
//-------------------------------------------------------------------------
function $import( path )
{
   var s,i;
   var ss = document.getElementsByTagName("script");
   for( var i = 0; i < ss.length; i++)
   {
       if( ss[i].src && ss[i].src.indexOf(path) > 0 ||
           ss[i].src && ss[i].src.indexOf( GetAbsoluteUrl( LIBRARY_PATH + path) ) > 0  )
       {
           return;
       }
   }  
   
   s = document.createElement("script");
   s.type = "text/javascript";
   s.src = LIBRARY_PATH + path;
   
   var head = document.getElementsByTagName("head")[0];
   head.appendChild(s);
}




//-------------------------------------------------------------------------
// Function Name    :GetAbsoluteUrl
// Parameter(s)     :path       file name
// Memo             :To get the Absolute Url of the file 
//-------------------------------------------------------------------------
function GetAbsoluteUrl(path) 
{
	var img = new Image();
	img.src = path;
	return img.src;
}


//-------------------------------------------------------------------------
// Function Name    :GetUrlParameter
// Parameter(s)     :strName    the parameter's name
// Memo             :To get parameter's value
//-------------------------------------------------------------------------
function GetUrlParameter(strName)
{
	var url = location.search.substring(1);
	var tempStr = strName + "=";
	if( url.indexOf(tempStr) == -1 )
		return null;
	if( url.indexOf("&") != -1 )
	{
		var a = url.split("&");
		var i = 0;
		
		for( i = 0; i < a.length; i++ )
		{
			if( a[i].indexOf(tempStr) != -1 )
				return a[i].substring(tempStr.length);
		}
	}
	else
	{
		return url.substring(tempStr.length);
	}
}



