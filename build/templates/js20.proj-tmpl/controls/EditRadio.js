/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires core/extend.js
  * @requires controls/EditCheckBox.js
*/

/* constructor
@param string id
@param object options{
	@param bool checked or value
	@param string descr radio description
*/
function EditRadio(id,options){
	options = options || {};
	
	options.type = options.type || "radio";
	options.cmdClear = false;
	
	
	var bs_col = window.getApp().getBsCol();	
	options.labelClassName = options.labelClassName || ("control-label "+(bs_col+"11"));	
	options.editContClassName = options.contClassName || ("input-group "+bs_col+"1");
	
	EditRadio.superclass.constructor.call(this,id,options);
	
	
	if (options.checked){
		this.setChecked(options.checked);
	}
	
}
extend(EditRadio,EditString);

/* constants */


/* public */
EditRadio.prototype.setChecked = function(checked){
	this.m_node.checked = checked;
}
EditRadio.prototype.getChecked = function(){
	return this.m_node.checked;
}
