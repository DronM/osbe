/************************************************************
 * Javascript Lib V1.2
 * CONTACT: jerry.wang@clochase.com
 *
 * this file is a class for AJAX
 ************************************************************/

// the ready state enum
ReadyState =
{
    Uninitialized   : 0,
    Loading         : 1,
    Loaded          : 2,
    Interactive     : 3,
    Complete        : 4
};

// the action type
ActionType =
{
    POST            : "POST",
    GET             : "GET"
}


// This AJAX class 
function AJAX( path )
{
    this.m_strPath                      = path;
    this.m_objXML                       = __GetXMLHttpObj();
    this.m_strAction                    = ActionType.GET;
    this.m_pfnCallBackFun               = null;
    this.m_objParam                     = null;
    this.m_strUrlParam                  = "";

    this.m_objXML.onreadystatechange    = (function(obj) 
            { 
		        return function()
		        {
		            if( obj.m_objXML.readyState == ReadyState.Complete )
		                (obj.m_pfnCallBackFun)( obj);
		        };    			
	        }) (this);
	
	
	//-------------------------------------------------------------------------
    // Function Name    :SetCustomParam
    // Parameter(s)     :objParam      customer parameter
    // Memo             :set the customer param
    //-------------------------------------------------------------------------
	this.SetCustomParam                 = function(objParam)
	{
	    this.m_objParam = objParam;
	}
	
	//-------------------------------------------------------------------------
    // Function Name    :GetCustomParam
    // Return           :get the customer param
    //-------------------------------------------------------------------------
	this.GetCustomParam                 = function()
	{
	    return this.m_objParam;
	}
	
	//-------------------------------------------------------------------------
    // Function Name    :AddUrlParameter
    // Parameter(s)     :strName        parameter name
    //                  :strValue       parameter value
    // Memo             :add a url parameter
    //-------------------------------------------------------------------------
	this.AddUrlParameter                = function(strName, strValue)
	{
	    if( this.m_strUrlParam.length > 0 )
	        this.m_strUrlParam += "&";
	        
	    this.m_strUrlParam += __URLEncode(strName.toString()) + "=" + __URLEncode(strValue.toString());
	}
	
	//-------------------------------------------------------------------------
    // Function Name    :ClearUrlParameters
    // Memo             :Clear all the url parameters
    //-------------------------------------------------------------------------
	this.ClearUrlParameters             = function()
	{
	    this.m_strUrlParam = "";
	}
    
    
    //-------------------------------------------------------------------------
    // Function Name    :SetCallbackFun
    // Parameter(s)     :pfnCallback        The handle of the call back function
    // Memo             :The call back function will be invoked when complete.
    //                  :and the first parameter of the call back function contain
    //                  :the AJAX instance.
    //-------------------------------------------------------------------------
    this.SetCallbackFun                 = function(pfnCallback)
    {
        this.m_pfnCallBackFun = pfnCallback;
    };
    
    //-------------------------------------------------------------------------
    // Function Name    :SetAction
    // Parameter(s)     :emActionType        ActionType enum
    // Memo             :set the action type
    //-------------------------------------------------------------------------
    this.SetAction                      = function(emActionType)
    {
        this.m_strAction = emActionType;
    };
    
    //-------------------------------------------------------------------------
    // Function Name    :Send
    // Memo             :send the request
    //-------------------------------------------------------------------------
    this.Send                           = function()
    {
        try
        {
            var strUrl = this.m_strPath;
            if( this.m_strUrlParam.length > 0 )
            {
                strUrl = strUrl + ((strUrl.indexOf("?") < 0) ? "?" : "&");
                strUrl += this.m_strUrlParam;
            }
            this.m_objXML.open( this.m_strAction, strUrl, true);
            this.m_objXML.send(null);
            return true;
        }
        catch(e)
        {
            alert(e);
            return false;        
        }
    };
    
    
    //-------------------------------------------------------------------------
    // Function Name    :GetXmlDoc
    // Return           :return the xml dom
    //-------------------------------------------------------------------------
    this.GetXmlDoc                      = function()
    {
        if( this.m_objXML.responseXML == null )
        {
            alert( "Error: the response does not contain a XML document!" );
            return null;
        }
        return this.m_objXML.responseXML;
    };
    
    //-------------------------------------------------------------------------
    // Function Name    :GetResponse
    // Return           :return the response text
    //-------------------------------------------------------------------------
    this.GetResponse                    = function()
    {
        if( this.m_objXML.responseText == null )
        {
            alert( "Error: the response is null!" );
            return null;
        }
        return this.m_objXML.responseText;
    };
}



/////////////////////////////////////////////////////////////////////////////////

function __GetXMLHttpObj()
{
	if( typeof(XMLHttpRequest) != 'undefined' )
		return new XMLHttpRequest();

	var aryNames = ['Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.4.0',
		'Msxml2.XMLHTTP.3.0', 'Msxml2.XMLHTTP', 'Microsoft.XMLHTTP'];
	for( var i = 0; i < aryNames.length; i++)
	{
	    try
	    {
			return new ActiveXObject(aryNames[i]);
		}
		catch(e){}
	}
		
    alert( "Error: can not create XML Http Object!" );
	return null;
}// class AJAX



function __URLEncode(strURL)
{
	var m = "", sp = "!'()*-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~";
	for( var i = 0; i < strURL.length; i++)
	{
		if(sp.indexOf(strURL.charAt(i))!=-1)
		{
			m += strURL.charAt(i)	
		}
		else
		{
			var n = strURL.charCodeAt(i)
			var t = "0"+n.toString(8)
			if( n > 0x7ff )
				m += ("%"+(224+parseInt(t.slice(-6,-4),8)).toString(16)+"%"+(128+parseInt(t.slice(-4,-2),8)).toString(16)+"%"+(128+parseInt(t.slice(-2),8)).toString(16)).toUpperCase()
			else if(n>0x7f)
				m += ("%"+(192+parseInt(t.slice(-4,-2),8)).toString(16)+"%"+(128+parseInt(t.slice(-2),8)).toString(16)).toUpperCase()
			else if(n>0x3f)
				m += ("%"+(64+parseInt(t.slice(-2),8)).toString(16)).toUpperCase()
			else if(n>0xf)
				m += ("%"+n.toString(16)).toUpperCase()
			else
				m += ("%"+"0"+n.toString(16)).toUpperCase()
		}
	}
	return m;
}
