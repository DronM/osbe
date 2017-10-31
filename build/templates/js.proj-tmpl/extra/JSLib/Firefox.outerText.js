/************************************************************
 * Javascript Lib V1.2
 * CONTACT: jerry.wang@clochase.com
 *
 * Add  outerText for Firefox
 ************************************************************/

if(window.HTMLElement) 
{
	 HTMLElement.prototype.__defineSetter__("outerText",function(sText){
        var parsedText=document.createTextNode(sText);
        this.outerHTML=parsedText;
        return parsedText;
        });
    HTMLElement.prototype.__defineGetter__("outerText",function(){
        var r=this.ownerDocument.createRange();
        r.selectNodeContents(this);
        return r.toString();
        });
}
