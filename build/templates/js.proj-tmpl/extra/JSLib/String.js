/************************************************************
 * Javascript Lib V1.2
 * CONTACT: jerry.wang@clochase.com
 *
 * Add trim / trimLeft / trimRight functions for String object
 ************************************************************/
 
String.prototype.trimLeft = function()
{
    return this.replace(/(^\s*)/g, "");
}

String.prototype.trimRight = function()
{
    return this.replace(/(\s*$)/g, "");
}

String.prototype.trim = function()
{
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

