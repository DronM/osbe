/************************************************************
 * Javascript Lib V1.2
 * CONTACT: jerry.wang@clochase.com
 *
 * This is the MaskEdit ctrl 
 *
 * InitializeMaskEdit( "TextboxID", "$A$d$A $d$A$d");
 * InitializeMaskEdit( "TextboxID", "($d$d$d)$d$d$d-$d$d$d");
 * InitializeMaskEdit( "TextboxID", "A*$d$d$d$d$d");
 ************************************************************/


//$import( "Textbox.Common.js" );


// These are escape character used in the mask pattern
var UPPER   = "\n";
var LOWER   = "\r";
var NUM     = "\t";
 
function RemoveMaskEdit(ctrl){	
	if (ctrl.f_onkeydown){
		EventHandler.removeEvent(ctrl,"keydown", ctrl.f_onkeydown);
		ctrl.f_onkeydown = undefined;
	}
	if (ctrl.f_onkeyup){
		EventHandler.removeEvent(ctrl,"keyup", ctrl.f_onkeyup);
		ctrl.f_onkeyup = undefined;
	}
	if (ctrl.f_onkeypress){
		EventHandler.removeEvent(ctrl,"keypress", ctrl.f_onkeypress);
		ctrl.f_onkeypress = undefined;
	}
	if (ctrl.f_onfocus){
		EventHandler.removeEvent(ctrl,"focus", ctrl.f_onfocus);		
		ctrl.f_onfocus = undefined;
	}
}	
//-------------------------------------------------------------------------
// Function Name    :InitializeMaskEdit
// Parameter(s)     :ctrl           The ID of the textbox
//                  :strMaskPattern  The mask pattern
// Return           :bool            Whether or not succeed
//-------------------------------------------------------------------------
function InitializeMaskEdit( ctrl, strMaskPattern)
{
   var strTemp = strMaskPattern;
   strMaskPattern = "";
   for( var i = 0; i < strTemp.length; i++)
   {
       if( strTemp.charAt(i) == '$' )
       {
           i++;
           if( strTemp.charAt(i) == '$' )
               strMaskPattern += "$";
           else
           {
               if( strTemp.charAt(i) == 'A' )  
                   strMaskPattern += UPPER;
               else if( strTemp.charAt(i) == 'a' )
                   strMaskPattern += LOWER;
               else if( strTemp.charAt(i) == 'd' )
                   strMaskPattern += NUM;
               else
                   alert( "Unknown escape character {$" + strTemp.charAt(i) + "}" );                            
           }
       }
       else
       {
           strMaskPattern += strTemp.charAt(i);       
       }
   }

   var obj = typeof(ctrl) == "string" ? document.getElementById(ctrl) : ctrl;
   if( obj == null )
   {
      alert( "Error:ctrl {" + ctrl + "} does not exist!" );
      return false;    
   }
   
   var strValue = obj.value;
   
   obj.setAttribute( "maskPattern", strMaskPattern);
   obj.value = "";
   
    for( var i = 0; i < strMaskPattern.length; i++)
    {
        if( strMaskPattern.charCodeAt(i) == UPPER.charCodeAt(0) ||
            strMaskPattern.charCodeAt(i) == LOWER.charCodeAt(0) ||
            strMaskPattern.charCodeAt(i) == NUM.charCodeAt(0) )
        {
            obj.value += strValue.length > i ? strValue.charAt(i) : "_";
            continue;
        }
        obj.value += strMaskPattern.charAt(i);
    }
	
	RemoveMaskEdit(obj);
	
	obj.f_onkeydown = function(evt){
		__MaskEditDispatcher(evt);
	};
	EventHandler.addEvent(obj,"keydown",obj.f_onkeydown);
	
	obj.f_onkeyup = function(evt){
		__SetCursorPosition(evt);
	};
	EventHandler.addEvent(obj,"keyup",obj.f_onkeyup);		
		
	obj.f_onkeypress = function(evt){
		__OnMaskEditUpdated(evt);
	};
	EventHandler.addEvent(obj,"keypress",obj.f_onkeypress);		
	
	
	
	obj.f_onfocus = function(evt){
		__OnMaskEditFocus(evt);
	};
	EventHandler.addEvent(obj,"focus",obj.f_onfocus);		
	
	/*
	obj.f_onkeydown = function(){ eval('__MaskEditDispatcher(event);'); };
    obj.attachEvent( 'onkeydown', obj.f_onkeydown);
	
	obj.f_onkeyup = function(){ eval('__SetCursorPosition(event);'); };
	obj.attachEvent( 'onkeyup', obj.f_onkeyup);
	
	obj.f_onkeypress = function(){ eval('__OnMaskEditUpdated(event);'); }
	obj.attachEvent( 'onkeypress', obj.f_onkeypress);
	
	obj.f_onfocus = function(){ eval('__OnMaskEditFocus(event);'); };
	obj.attachEvent( 'onfocus', obj.f_onfocus);
	*/
	obj.setAttribute( "position", -1);
	
	// disbale the actocomplete & paste & drag & drop for IE
    if( document.all )
    {
        obj.setAttribute( "autocomplete",  "off");
        //obj.onpaste = function(){ return false; };
        //obj.ondrag = function(){ return false; };
        //obj.ondrop = function(){ return false; };
        //obj.oncut = function(){ return false; };
        //obj.oncontextmenu = function(){ return false; };
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////


//-------------------------------------------------------------------------
// Function Name    :__OnMaskEditFocus
// Parameter(s)     :evt             event
// Memo             :When the mask edit focused
//-------------------------------------------------------------------------
function __OnMaskEditFocus(evt)
{
    var obj = evt.srcElement == null ? evt.target : evt.srcElement;
    
    var strValue = obj.value;
    for( var i = 0; i < strValue.length; i++)
	{
		if( strValue.charCodeAt(i) == "_".charCodeAt(0) )
		{
			obj.setAttribute( "position", i);
			__SetCursorPosition(evt);
			return true;
		}
	}
	
	return true;
}

//-------------------------------------------------------------------------
// Function Name    :__MaskEditDispatcher
// Parameter(s)     :evt             event
// Memo             :This is the dispatcher to handle DELETE & BACKSPACE
//-------------------------------------------------------------------------
function __MaskEditDispatcher(evt)
{
    __SaveKeyCode(evt);
    
    switch(__GetKeyCode(evt)) 
    {
    case VKeyCode.VK_DELETE:
        __OnMaskEditDelKey(evt);
    	break;
	case VKeyCode.VK_BACK:
        __OnMaskEditBackKey(evt);
    	break;
    default:
        break;
    }
}

//-------------------------------------------------------------------------
// Function Name    :__OnMaskEditBackKey
// Parameter(s)     :evt             event
// Memo             :This is to handle BACKSPACE
//-------------------------------------------------------------------------
function __OnMaskEditBackKey(evt)
{
	var obj = evt.srcElement == null ? evt.target : evt.srcElement;
    var strMaskPattern = obj.getAttribute( "maskPattern" );
    
	var nStart = __GetCursorStartPos(evt);
	var nEnd = __GetCursorEndPos(evt);

	if( nStart != nEnd )
	{
		__OnMaskEditDelKey(evt);
	}
	else
	{
		for( var i = nStart - 1; i >= 0; i--)
		{
			if( strMaskPattern.charCodeAt(i) == UPPER.charCodeAt(0) ||
				strMaskPattern.charCodeAt(i) == LOWER.charCodeAt(0) ||
				strMaskPattern.charCodeAt(i) == NUM.charCodeAt(0) )
			{
				__ReplaceText( evt, "_", i, i+1);
				obj.setAttribute( "position", i);
				break;
			}
		}
	}
    
    
    if( evt.preventDefault ) { evt.preventDefault(); }
    evt.returnValue = false;
    return false;
}


//-------------------------------------------------------------------------
// Function Name    :__OnMaskEditDelKey
// Parameter(s)     :evt             event
// Memo             :This is to handle DELETE
//-------------------------------------------------------------------------
function __OnMaskEditDelKey(evt)
{    
    var obj = evt.srcElement == null ? evt.target : evt.srcElement;
    var strMaskPattern = obj.getAttribute( "maskPattern" );
    
    var strValue = "";
	var nStart = __GetCursorStartPos(evt);
	var nEnd = __GetCursorEndPos(evt);

	if( nStart != nEnd )
	{
		for( var i = nStart; i < nEnd; i++)
		{
			
			if( strMaskPattern.charCodeAt(i) == UPPER.charCodeAt(0) ||
				strMaskPattern.charCodeAt(i) == LOWER.charCodeAt(0) ||
				strMaskPattern.charCodeAt(i) == NUM.charCodeAt(0) )
			{
				strValue += "_";
				continue;
			}
			
			strValue += strMaskPattern.charAt(i);
		}

		__ReplaceText( evt, strValue, nStart, nEnd);
		obj.setAttribute( "position", nStart);
	}
	else
	{
		for( var i = nStart; i < strMaskPattern.length; i++)
		{
			if( strMaskPattern.charCodeAt(i) == UPPER.charCodeAt(0) ||
				strMaskPattern.charCodeAt(i) == LOWER.charCodeAt(0) ||
				strMaskPattern.charCodeAt(i) == NUM.charCodeAt(0) )
			{
				__ReplaceText( evt, "_", i, i+1);
				break;
			}
		}
	}
    
    
    if( evt.preventDefault ) { evt.preventDefault(); }
    evt.returnValue = false;
    return false;
}


//-------------------------------------------------------------------------
// Function Name    :__OnMaskEditUpdated
// Parameter(s)     :evt             event
// Memo             :This is to handle other keys
//-------------------------------------------------------------------------
function __OnMaskEditUpdated(evt)
{
	var key_code = __GetKeyCode(evt);
	var obj = evt.srcElement == null ? evt.target : evt.srcElement;
	
	//ctrl+c,v,z
	if (evt.ctrlKey&&(key_code==67||key_code==90)){
		return true;
	}
	else if (evt.ctrlKey&&key_code==86){
		obj.select();
		return true;
	}
	
	if(  key_code== VKeyCode.VK_LEFT ||
		key_code == VKeyCode.VK_RIGHT ||
		key_code == VKeyCode.VK_NUMLOCK ||
		key_code == VKeyCode.VK_HOME ||
		key_code == VKeyCode.VK_END ||
		key_code == VKeyCode.VK_TAB ||
		key_code == VKeyCode.VK_LEFT )
	{
		return true;
	}
	
    var strMaskPattern = obj.getAttribute( "maskPattern" );

	var nStart = __GetCursorStartPos(evt);
	var nEnd = __GetCursorEndPos(evt);

	if( nStart != nEnd )
	{
		__OnMaskEditDelKey(evt);
		nStart = __GetCursorStartPos(evt);
	}


	var nIndex = -1;
	for( var i = nStart; i < strMaskPattern.length; i++)
	{
		
		if( strMaskPattern.charCodeAt(i) == UPPER.charCodeAt(0) ||
			strMaskPattern.charCodeAt(i) == LOWER.charCodeAt(0) ||
			strMaskPattern.charCodeAt(i) == NUM.charCodeAt(0) )
		{
			nIndex = i;
			break;
		}
	}

	if( nIndex == -1 )
	{
		if( evt.preventDefault ) { evt.preventDefault(); }
		evt.returnValue = false;
		return false;
	}


	if( strMaskPattern.charCodeAt(nIndex) == UPPER.charCodeAt(0) ||
		strMaskPattern.charCodeAt(nIndex) == LOWER.charCodeAt(0) )
	{
		if( !__EnableKeys( evt,
            [ 
                VKeyCode.VK_A,
                VKeyCode.VK_B,
                VKeyCode.VK_C,
                VKeyCode.VK_D,
                VKeyCode.VK_E,
                VKeyCode.VK_F,
                VKeyCode.VK_G,
                VKeyCode.VK_H,
				VKeyCode.VK_I,
				VKeyCode.VK_J,
				VKeyCode.VK_K,
				VKeyCode.VK_L,
				VKeyCode.VK_M,
				VKeyCode.VK_N,
				VKeyCode.VK_O,
				VKeyCode.VK_P,
				VKeyCode.VK_Q,
				VKeyCode.VK_R,
				VKeyCode.VK_S,
				VKeyCode.VK_T,
				VKeyCode.VK_U,
				VKeyCode.VK_V,
				VKeyCode.VK_W,
				VKeyCode.VK_X,
				VKeyCode.VK_Y,
				VKeyCode.VK_Z,
            ])
			)
		{
			if( evt.preventDefault ) { evt.preventDefault(); }
			evt.returnValue = false;
			return false;
		}
	}
	else if( strMaskPattern.charCodeAt(nIndex) == NUM.charCodeAt(0) )
	{
		if( !__EnableKeys( evt,
            [ 
                VKeyCode.VK_0,
                VKeyCode.VK_1,
                VKeyCode.VK_2,
                VKeyCode.VK_3,
                VKeyCode.VK_4,
                VKeyCode.VK_5,
                VKeyCode.VK_6,
                VKeyCode.VK_7,
                VKeyCode.VK_8,
                VKeyCode.VK_9,
                VKeyCode.VK_NUMPAD0,
                VKeyCode.VK_NUMPAD1,                     
                VKeyCode.VK_NUMPAD2,
                VKeyCode.VK_NUMPAD3,
                VKeyCode.VK_NUMPAD4,
                VKeyCode.VK_NUMPAD5,
                VKeyCode.VK_NUMPAD6,
                VKeyCode.VK_NUMPAD7,
                VKeyCode.VK_NUMPAD8,
                VKeyCode.VK_NUMPAD9,
            ]) || evt.shiftKey
			)
		{
			if( evt.preventDefault ) { evt.preventDefault(); }
			evt.returnValue = false;
			return false;
		}
	}


	var strChar = String.fromCharCode( evt.keyCode == 0 ? evt.which : evt.keyCode);
	
	if( strMaskPattern.charCodeAt(nIndex) == UPPER.charCodeAt(0) )
	    strChar = strChar.toUpperCase();
	else if( strMaskPattern.charCodeAt(nIndex) == LOWER.charCodeAt(0) )
	    strChar = strChar.toLowerCase();
	
	__ReplaceText( evt, strChar, nIndex, nIndex+1);
	
	// set the cursor
	var bLast = true;
	for( var i = nIndex + 1; i < strMaskPattern.length; i++)
	{
		if( strMaskPattern.charCodeAt(i) == UPPER.charCodeAt(0) ||
			strMaskPattern.charCodeAt(i) == LOWER.charCodeAt(0) ||
			strMaskPattern.charCodeAt(i) == NUM.charCodeAt(0) )
		{
			nIndex = i;
			bLast = false;
			break;
		}
	}	
	obj.setAttribute( "position", bLast ? nIndex + 1 : nIndex);	
	if( obj.selectionStart != null )
	{
	    obj.selectionStart = bLast ? nIndex + 1 : nIndex;
	    obj.selectionEnd = bLast ? nIndex + 1 : nIndex;
	}
	

	if( evt.preventDefault ) { evt.preventDefault(); }
	evt.returnValue = false;
	return false;
}// __OnMaskEditUpdated




