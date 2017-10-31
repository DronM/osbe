/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2012
 
 * @class
 * @classdesc button for printing

 * @extends ButtonCtrl 

 * @requires core/extend.js
 * @requires controls/ButtonCtrl.js     
  
 * @param {string} id - html tag id
 * @param {namespase} options
 * @param {string} options.fieldId
 * @param {string} options.DOMId
 * @param {Controller} options.controller
 * @param {string} [options.methodId=DEF_METH]
 */
function ButtonPrint(id,options){
	options = options || {};
	var self = this;
	options.onClick = options.onClick || function(){
		self.onClick();
	};
	
	this.m_fieldId = options.fieldId;
	this.m_DOMId = options.DOMId;
	this.m_controller = options.controller;
	this.m_methodId = options.methodId || this.DEF_METH;
	
	ButtonPrint.superclass.constructor.call(this,id,options);
}
extend(ButtonPrint,ButtonCmd);

ButtonPrint.prototype.onClick = function(){
	if (this.m_DOMId){
		var pm = this.m_controller.getPublicMethod();
		pm.setFieldValue(this.m_paramId,CommonHelper.nd(this.m_DOMId).getAttribute("old_id"));
	}
	this.m_controller.run(this.m_methodId,{
		xml:false,
		ok:function(resp){
			WindowPrint.show({content:resp});
		}
	});
}

ButtonPrint.prototype.DEF_METH = "get_print";
