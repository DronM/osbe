/************************************************************
 * Javascript Lib V1.2
 * CONTACT: jerry.wang@clochase.com
 *
 * This is the Auto-Trim box
 *
 * InitializeTrimBox( "TextboxID" );
 * InitializeTrimBox( null );
 ************************************************************/

//$import( "String.js" );
//$import( "Firefox.attachEvent.js" );

//-------------------------------------------------------------------------
// Function Name    :InitializeTrimBox
// Parameter(s)     :ctrl           The ID of the textbox [can be null], or instance
// Memo             :If the ctrl is null, this function will Initialize
//                  :all the textboxes on the page
//-------------------------------------------------------------------------
function InitializeTrimBox(ctrl)
{
    if( ctrl != null )
    {
        var obj = typeof(ctrl) == "string" ? document.getElementById(ctrl) : ctrl;
        if( obj == null )
        {
            alert( "Error:ctrl {" + ctrl + "} does not exist!" );
            return false;    
        }
        
        __TrimBoxAddEventHandler(obj);
        return true;
    }
    
    var aryObject = document.getElementsByTagName("input");
    for( var i = 0; i < aryObject.length; i++)
    {
        var obj = aryObject[i];
        __TrimBoxAddEventHandler(obj);
    }
    
    return true;
}

//-------------------------------------------------------------------------
// Function Name    :__TrimBoxAddEventHandler
// Parameter(s)     :obj           The object of the textbox
// Memo             :Add event handle for the textbox
//-------------------------------------------------------------------------
function __TrimBoxAddEventHandler(obj)
{
     if( obj.type != "text" )
        return;
        
    //obj.attachEvent( 'onchange', (function(p) 
	obj.f_onchange = function(p) 
        { 
	        return function()
	        {
	            p.value = p.value.trim();            
	        };    			
        };/*) (obj)
        );
	*/
	EventHandler.addEvent(obj,"change",obj.f_onchange);
}