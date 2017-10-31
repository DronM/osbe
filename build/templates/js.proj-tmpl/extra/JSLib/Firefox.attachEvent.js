/************************************************************
 * Javascript Lib V1.2
 * CONTACT: jerry.wang@clochase.com
 *
 * Add  attachEvent for Firefox
 ************************************************************/
if( window.attachEvent == null ){
    HTMLElement.prototype.attachEvent = function(sType,fHandler)
    {
        var shortTypeName=sType.replace(/on/,"");
        fHandler._ieEmuEventHandler=function(e){
            window.event=e;
            return fHandler();
            }
        this.addEventListener(shortTypeName,fHandler._ieEmuEventHandler,false);
    }    
};
if( window.detachEvent == null ){
    HTMLElement.prototype.detachEvent = function(sType,fHandler)
    {
        var shortTypeName=sType.replace(/on/,"");
        fHandler._ieEmuEventHandler=function(e){
            window.event=e;
            return fHandler();
            }
        this.removeEventListener(shortTypeName,fHandler._ieEmuEventHandler,false);
    }    
};