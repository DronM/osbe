/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires js/extra/JSLib/Global.js
 * @requires js/extra/JSLib/Textbox.Restriction.js 
 * @requires js/extra/JSLib/Textbox.MaskEdit.js  
 * @requires js/extra/JSLib/Textbox.Trim.js  
 */

/* constructor */
function MaskEdit(id,editMask){
	InitializeMaskEdit(id, editMask);
}
function TipEdit(id,strTip){
	InitializeTipBox(id, strTip);
}