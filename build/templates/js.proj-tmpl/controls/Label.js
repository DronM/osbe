/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
  * @requires controls/Control.js
*/

/* constructor */
function Label(oldOpts,options){
	var id;
	if (!options){
		options = oldOpts;
		id = options.id;
	}
	else{
		id = oldOpts;
	}
	options = options || {};
	var tagName = options.tagName || this.DEF_TAG_NAME;
	options.className = options.className || this.DEF_CLASS;
	Label.superclass.constructor.call(this,
		id,tagName,options);
	if (options.caption!=undefined){
		this.setCaption(options.caption);
	}
}
extend(Label,Control);

Label.prototype.DEF_TAG_NAME = 'label';
Label.prototype.DEF_CLASS = "lbl";

Label.prototype.setCaption = function(caption){
	this.setValue(caption);
}
Label.prototype.getCaption = function(){
	return this.getValue();
}