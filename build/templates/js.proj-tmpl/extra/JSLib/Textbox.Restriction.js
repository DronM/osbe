/************************************************************
 * Javascript Lib V1.2
 * CONTACT: jerry.wang@clochase.com
 *
 * These are textbox with restriction
 *
 * InitializeTextbox( "TextboxID", InputType.NonnegativeInteger);
 * InitializeTextbox( "TextboxID", InputType.WholeNumber);
 * InitializeTextbox( "TextboxID", InputType.Currency); 
 * InitializeTextbox( "TextboxID", InputType.FloatNumber); 
 ************************************************************/




//$import( "Textbox.Common.js" );



// the input type of the text box
InputType =
{
    NonnegativeInteger   : 0,
    WholeNumber          : 1,
    Currency             : 2,
	Float	             : 3
};
 
function RemoveTextbox(ctrl){
	if (ctrl.f_onkeydown){
		EventHandler.removeEvent(ctrl,"keydown", ctrl.f_onkeydown);
		ctrl.f_onkeydown = undefined;
	}
	if (ctrl.f_onkeypress){
		EventHandler.removeEvent(ctrl,"keypress", ctrl.f_onkeypress);
		ctrl.f_onkeypress = undefined;
	}
	if (ctrl.f_onblur){
		EventHandler.removeEvent(ctrl,"blur", ctrl.f_onblur);
		ctrl.f_onfocus = undefined;
	}	
}

//-------------------------------------------------------------------------
// Function Name    :InitializeTextbox
// Parameter(s)     :ctrl         the ctrl id or the ctrl instance
//                  :emType     	the InputType
//					: floatPrecision int float number precision
// Return           :bool
//-------------------------------------------------------------------------
function InitializeTextbox( ctrl, emType,floatPrecision,unsigned){
    var obj = typeof(ctrl) == "string" ? document.getElementById(ctrl) : ctrl;
    if( obj == null )
    {
        alert( "Error:ctrl {" + ctrl + "} does not exist!" );
        return false;    
    }
    
	RemoveTextbox(obj);
	
	obj.f_onkeydown = function(event){
		__SaveKeyCode(event);
	}
	EventHandler.addEvent(obj,"keydown",obj.f_onkeydown);
    //obj.attachEvent( 'onkeydown', function(){ eval('__SaveKeyCode(event);') });
    
    // disbale the actocomplete & paste & drag & drop for IE
    if( document.all )
    {
        obj.setAttribute( "autocomplete",  "off");
        obj.onpaste = function(){ return false; };
        obj.ondrag = function(){ return false; };
        obj.ondrop = function(){ return false; };
    }
    /*
	if (emType==InputType.FloatNumber
	||emType==InputType.Currency){
		var float_blur = ;
	}
	*/
	
	//default
	unsigned = (unsigned!=undefined)? unsigned:true;
	
    switch(emType)
    {
        case InputType.NonnegativeInteger:
            //obj.attachEvent( 'onkeypress', function(){ eval('__AcceptNonnegativeInteger(event);'); });
			obj.f_onkeypress = function(event){
				return __AcceptNonnegativeInteger(event);
			}			
            break;
            
        case InputType.WholeNumber:
            //obj.attachEvent( 'onkeypress', function(){ eval('__AcceptWholeNumber(event);'); });
			obj.f_onkeypress = function(event){
				return __AcceptWholeNumber(event);
			}
			
            break;
        case InputType.FloatNumber:
            //obj.attachEvent( 'onkeypress', function(){ eval('__AcceptFloatNumber(event,floatPrecision,unsigned);'); });
			obj.f_onkeypress = function(event){
				return __AcceptFloatNumber(event,floatPrecision,unsigned);
			}
			
			if (floatPrecision){
				//obj.attachEvent( 'onblur', (function(p){ 
				obj.f_onblur = function(p){
					return function(){
						var frac_zer = "000000000000000".substring(0,floatPrecision);
						if( p.value.length == 0 )							
							p.value = "0."+frac_zer;
						else{
							var nIndex = p.value.indexOf('.');
							if( nIndex == 0 ){
								p.value = "0" + p.value;
								p.value = p.value.substring( 0, nIndex + floatPrecision+1);
							}
							else if( nIndex > 0 ){
								p.value = p.value.substring( 0, nIndex + floatPrecision+1);
							}
							else{
								p.value = p.value + "."+frac_zer;
							}
							
							var offset = p.value.length - p.value.lastIndexOf('.') - 1;
							for( var k = offset; k < floatPrecision; k++){
								p.value = p.value + "0";		        
							};
						}
					};    			
				};
				/*
				) (obj)
				);
				*/				
			}
            break;
            
        case InputType.Currency:
            //obj.attachEvent( 'onkeypress', function(){ eval('__AcceptCurrency(event,2,unsigned);'); });
			obj.f_onkeypress = function(event){
				return __AcceptCurrency(event,2,unsigned);
			}

            //obj.attachEvent( 'onblur', (function(p){ 
			obj.f_onblur = function(p){
		        return function(){
		            if( p.value.length == 0 )
		                p.value = "0.00";		
		            else
		            {
		                var nIndex = p.value.indexOf('.');
		                if( nIndex == 0 )
		                {
		                    p.value = "0" + p.value;
		                    p.value = p.value.substring( 0, nIndex + 3);
		                }
		                else if( nIndex > 0 )
		                {
	                        p.value = p.value.substring( 0, nIndex + 3);            
		                }
		                else
		                {
		                    p.value = p.value + ".00";			        
		                }
    			        
		                var offset = p.value.length - p.value.lastIndexOf('.') - 1;
		                for( var k = offset; k < 2; k++)
		                {
		                    p.value = p.value + "0";		        
		                };
		            }
		        };    			
	        };			
			/*
			) (obj)
	        );
			*/
            break;            
            
        default:
            alert( "Error:unknown input type {" + emType + "}!" );
            return false; 
    }; 

	if (obj.f_onkeypress){
		EventHandler.addEvent(obj,"keypress",obj.f_onkeypress);	
	}
	if (obj.f_onblur){
		EventHandler.addEvent(obj,"blur",obj.f_onblur);
	}
    return true;
 }



///////////////////////////////////////////////////////////////////////////////////////////////


//-------------------------------------------------------------------------
// Function Name    :__AcceptNonnegativeInteger
// Parameter(s)     :evt        event
// Return           :bool
// Memo             :Only accepted nonnegative integer
//-------------------------------------------------------------------------
function __AcceptNonnegativeInteger(evt)
{
    if( evt.shiftKey )
    {
        __EnableKeys( evt,
            [ 
                VKeyCode.VK_LEFT,
                VKeyCode.VK_RIGHT,
                VKeyCode.VK_BACK,
                VKeyCode.VK_DELETE,
                VKeyCode.VK_NUMLOCK,
                VKeyCode.VK_HOME,
                VKeyCode.VK_END,
                VKeyCode.VK_TAB
            ]
            );
    }
    else{
        __EnableKeys( evt,
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
                VKeyCode.VK_LEFT,
                VKeyCode.VK_RIGHT,
                VKeyCode.VK_BACK,
                VKeyCode.VK_DELETE,
                VKeyCode.VK_NUMLOCK,
                VKeyCode.VK_HOME,
                VKeyCode.VK_END,
                VKeyCode.VK_TAB
            ]
            );    
    }// if_else    
}// __AcceptNonnegativeInteger


//-------------------------------------------------------------------------
// Function Name    :__AcceptWholeNumber
// Parameter(s)     :evt        event
// Return           :bool
// Memo             :Accepted whole numbers
//-------------------------------------------------------------------------
function __AcceptWholeNumber(evt)
{   
    var obj = evt.srcElement == null ? evt.target : evt.srcElement;
	var key_code = __GetKeyCode(evt);
	
	//ctrl+c,v,z
	if (evt.ctrlKey&&(key_code==67||key_code==90)){
		return true;
	}
	else if (evt.ctrlKey&&key_code==86){
		obj.select();
		return true;
	}
	//debugger;
    if( key_code == VKeyCode.VK_SUBTRACT ||
        key_code == VKeyCode.VK_OEM_MINUS||
		key_code == 173){
        if( __GetCursorStartPos(evt) == 0 &&
            __GetCursorEndPos(evt) == 0 &&
            obj.value.indexOf('-') < 0 &&
            !evt.shiftKey ){
            return true;
        };
        
        if( __GetCursorStartPos(evt) == 0 &&
            __GetCursorEndPos(evt) > 0 &&
            !evt.shiftKey ){
            return true;
        };
            
        if( evt.preventDefault ){
			evt.preventDefault();
		}
        evt.returnValue = false;
        return false;
    }

    return __AcceptNonnegativeInteger(evt);
}// __AcceptWholeNumber

//-------------------------------------------------------------------------
// Function Name    :__AcceptFloatNumber
// Parameter(s)     :evt        event
// Return           :bool
// Memo             :Accepted whole numbers
//-------------------------------------------------------------------------
function __AcceptFloatNumber(evt,floatPrecision,unsigned)
{   
    return __AcceptCurrency(evt,floatPrecision,unsigned);
}// __AcceptFloatNumber




//-------------------------------------------------------------------------
// Function Name    :__AcceptCurrency
// Parameter(s)     :evt        event
// Return           :bool
// Memo             :Accepted Currency
//-------------------------------------------------------------------------
function __AcceptCurrency(evt,floatPrecision,unsigned){
    var obj = evt.srcElement == null ? evt.target : evt.srcElement;
   //alert(__GetKeyCode(evt));
   /*
    if( evt.shiftKey )
    {
        return __EnableKeys( evt,
            [ 
                VKeyCode.VK_LEFT,
                VKeyCode.VK_RIGHT,
                VKeyCode.VK_BACK,
                VKeyCode.VK_DELETE,
                VKeyCode.VK_NUMLOCK,
                VKeyCode.VK_HOME,
                VKeyCode.VK_END,
                VKeyCode.VK_TAB,
				190
            ]
            );
    }
	*/
	//debugger;
	var sep_ind = obj.value.indexOf('.');
	var evt_key_code = __GetKeyCode(evt);
    if (evt_key_code== VKeyCode.VK_OEM_PERIOD ||
        evt_key_code == VKeyCode.VK_DECIMAL ||
		evt_key_code == 191 ||
		evt_key_code == 110 ||
		evt_key_code == 190){
		/*
        if( evt.shiftKey )
        {
            if( evt.preventDefault ) { evt.preventDefault(); }
            evt.returnValue = false;
            return false;
        }
          */
        if (sep_ind<0 ){
			obj.value=obj.value+'.';
            evt.returnValue = false;
			if( evt.preventDefault ) { evt.preventDefault(); }
            return false;
         }
        if( sep_ind >= 0 )
        {
            if( __GetCursorStartPos(evt) <= sep_ind &&
                __GetCursorEndPos(evt) >= sep_ind )
            {
                return true;           
            };
           
            if (evt.preventDefault){
				evt.preventDefault();
			}
            evt.returnValue = false;
            return false;
        }
        else{
            return true;
        }
    }
	else if (
	(evt_key_code>=VKeyCode.VK_0)
	//&&evt_key_code<=VKeyCode.VK_9)
	&&sep_ind>=0
	&&!selectedText(obj)
	&&(obj.value.length+1-sep_ind-1)>floatPrecision){
		//over limit!
		if (evt.preventDefault){
			evt.preventDefault();
		}		
		evt.returnValue = false;
		return false;
	}
    
	if (unsigned){		
		return __AcceptNonnegativeInteger(evt);
	}
	else{
		return __AcceptWholeNumber(evt);
	}
}// __AcceptCurrency

