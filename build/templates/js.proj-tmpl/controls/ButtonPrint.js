/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
  * @requires common/EventHandler.js
  * @requires controls/Button.js
*/

/* constructor */
function ButtonPrint(id,options){
	options = options || {};
	options.caption = (options.image)? null:options.caption||"Печать";
	var self = this;
	options.onClick = options.onClick||function(){
		self.onClick();
	};
	options.attrs=options.attrs||{};
	options.attrs.title =options.attrs.title||"Печать документа";
	options.className = options.className||"viewBtn";
	
	this.m_params = options.params;
	this.m_paramId = options.paramId;
	this.m_DOMId = options.DOMId;
	this.m_controller = options.controller;
	this.m_errorControl = options.errorControl;
	this.m_methodId = options.methodId;
	
	ButtonPrint.superclass.constructor.call(
		this,id,options);
}
extend(ButtonPrint,Button);

ButtonPrint.prototype.onClick = function(){
	if (this.m_DOMId){
		this.m_params[this.m_paramId]=nd(this.m_DOMId).getAttribute("old_id");
	}
	this.m_controller.run(this.m_methodId||"get_print",{
	xml:false,
	async:true,
	errControl:this.m_errorControl,
	params:this.m_params,
	func:function(resp){
		WindowPrint.show({content:resp});
	}
	});
}