/************************************************************
 * Javascript Lib V1.2
 * CONTACT: jerry.wang@clochase.com
 *
 ************************************************************/


$import( "Keyboard.js" );




///////////////////////////////////////////////////////////////////////////////////////

//-------------------------------------------------------------------------
// Function Name    :__EnableKeys
// Parameter(s)     :evt        event
//                  :keyCodes   the key code should be accepted
// Return           :bool
// Memo             :This function is used to limit the input characters
//                  :When the keyCode is indicated in the keyCodes, the 
//                  :key will be accepted, otherwise will be rejected
//-------------------------------------------------------------------------
function __EnableKeys( evt, keyCodes)
{
    for( var i = 0; i < keyCodes.length; i++)
    {
        if( parseInt( keyCodes[i], 10) == __GetKeyCode(evt) )
            return true;
    }
    
    if( evt.preventDefault ) { evt.preventDefault(); }
    evt.returnValue = false;
    return false;
}


//-------------------------------------------------------------------------
// Function Name    :__DisableKeys
// Parameter(s)     :evt        event
//                  :keyCodes   the key code should be rejected
// Return           :bool
// Memo             :This function is used to limit the input characters
//                  :When the keyCode is indicated in the keyCodes, the 
//                  :key will be rejected, otherwise will be accepted
//-------------------------------------------------------------------------
function __DisableKeys( evt, keyCodes)
{
    for( var i = 0; i < keyCodes.length; i++)
    {
        if( parseInt( keyCodes[i], 10) == __GetKeyCode(evt) )
        {
            if( evt.preventDefault ) { evt.preventDefault(); }
            evt.returnValue = false;
            return false;
         }
    }
    return true;
}


//-------------------------------------------------------------------------
// Function Name    :__SaveKeyCode
// Parameter(s)     :evt        event
// Memo             :Save the virtual key code, invoked by "onkeyup"
//-------------------------------------------------------------------------
function __SaveKeyCode(evt)
{
    var obj = evt.srcElement == null ? evt.target : evt.srcElement;
    obj.setAttribute( "keyCode", evt.keyCode);
}

//-------------------------------------------------------------------------
// Function Name    :__GetKeyCode
// Parameter(s)     :evt        event
// Return           :virtual key code
// Memo             :get the virtual key code
//-------------------------------------------------------------------------
function __GetKeyCode(evt)
{
    var obj = evt.srcElement == null ? evt.target : evt.srcElement;
    return parseInt( obj.getAttribute("keyCode"), 10);
}

//-------------------------------------------------------------------------
// Function Name    :__GetCursorStartPos
// Parameter(s)     :evt        event
// Return           :the start position of the cursor
//-------------------------------------------------------------------------
function __GetCursorStartPos(evt)
{
    var obj = evt.srcElement == null ? evt.target : evt.srcElement;

	var nPosition = parseInt( obj.getAttribute("position"), 10);
	if( nPosition >= 0 )
		return nPosition;
    
    // IE
    if( document.selection != null )
    {
        var cur = document.selection.createRange();
        var pos = 0;
        if (obj && cur) 
        {
            var tr = obj.createTextRange();
            if (tr) 
            {
                while (cur.compareEndPoints("StartToStart", tr) > 0) 
                {
                    tr.moveStart("character", 1);
                    pos++;
                }
                return pos;
            }
        }
        return -1;
    }
    else if( obj.selectionStart != null )// FF
    {
        return obj.selectionStart;
    }
    else
    {
        return -1;
    }
}


//-------------------------------------------------------------------------
// Function Name    :__GetCursorEndPos
// Parameter(s)     :evt        event
// Return           :the end position of the cursor
//-------------------------------------------------------------------------
function __GetCursorEndPos(evt)
{
    var obj = evt.srcElement == null ? evt.target : evt.srcElement;
    
	var nPosition = parseInt( obj.getAttribute("position"), 10);
	if( nPosition >= 0 )
		return nPosition;

    // IE
    if( document.selection != null )
    {
        var cur = document.selection.createRange();
        var pos = 0;
        if (obj && cur) 
        {
            var tr = obj.createTextRange();
            if (tr) 
            {
                while (cur.compareEndPoints("EndToStart", tr) > 0) 
                {
                    tr.moveStart("character", 1);
                    pos++;
                }
                return pos;
            }
        }
        return -1;
    }
    else if( obj.selectionStart != null )// FF
    {
        return obj.selectionEnd;
    }
    else
    {
        return -1;
    }
}


//-------------------------------------------------------------------------
// Function Name    :__SetCursorPosition
// Parameter(s)     :evt        event
// Return           :the end position of the cursor
//-------------------------------------------------------------------------
function __SetCursorPosition(evt)
{
	var obj = evt.srcElement == null ? evt.target : evt.srcElement;

	var nPosition = parseInt( obj.getAttribute("position"), 10);
	if( nPosition < 0 )
		return true;

	obj.setAttribute( "position", -1);

    // IE
    if( document.selection != null )
    {
        var cur = document.selection.createRange();
        var pos = 0;
        if (obj && cur) 
        {
            var range = obj.createTextRange();   
            range.move("character", nPosition);   
            range.select();   
            return true;
        }        
    }
    else if( obj.selectionStart != null )// FF
    {
        obj.setSelectionRange( nPosition, nPosition);
		obj.selectionStart = nPosition;
		obj.selectionEnd = nPosition;
    }
    else
    {
		window.status = "Unsupport browser!";
    }

	return true;
}



//-------------------------------------------------------------------------
// Function Name    :__ReplaceText
// Parameter(s)     :evt        event
//                  :strText    the text should be inserted
//                  :nStart     the start position of the selection
//                  :nEnd       the end position of the selection
// Memo             :To replace text in the textbox
//-------------------------------------------------------------------------
function __ReplaceText( evt, strText, nStart, nEnd)
{
    var obj = evt.srcElement == null ? evt.target : evt.srcElement;

	// IE
    if( document.all )
    {
        var tr = obj.createTextRange();
        tr.moveEnd("character", nEnd - obj.value.length);
        tr.moveStart("character", nStart);
        tr.text = strText; 
        tr.select();
    }
	else// FF
	{
		var strBefore = obj.value.substr(0, nStart);
		var strSelected = obj.value.substr(nStart, (nEnd - nStart));
		var strAfter = obj.value.substr(nEnd, (obj.value.length - nEnd));
		obj.value = strBefore + strText + strAfter;
	}
}