
if(window.attachEvent==null)
{HTMLElement.prototype.attachEvent=function(sType,fHandler)
{var shortTypeName=sType.replace(/on/,"");fHandler._ieEmuEventHandler=function(e){window.event=e;return fHandler();}
this.addEventListener(shortTypeName,fHandler._ieEmuEventHandler,false);}};