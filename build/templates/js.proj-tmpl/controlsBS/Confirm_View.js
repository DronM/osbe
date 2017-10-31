/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	

	Description
*/
//ф
/** Requirements
 * @requires common/functions.js
*/

/* constructor */
function Confirm_View(id,options){
	options = options || {};
	Confirm_View.superclass.constructor.call(this,
		id,"div",options);	
		
	this.m_onClose = options.onClose;
		
	this.addElement(options.text);
	
	var self = this;
	
	this.addElement(new Button(id+"_btnYes",		
			{"caption":"Да",
			"onClick":function(){
				self.m_onClose.call(self,WindowQuestion.RES_YES);
			},
			"attrs":{
				"title":"подтвердить"},
			"className":"viewBtn"
			})	
	);
	this.addElement(new Button(id+"_btnNo",		
			{"caption":"Нет",
			"onClick":function(){
				self.m_onClose.call(self,WindowQuestion.RES_NO);
			},
			"attrs":{
				"title":"отказаться"},
			"className":"viewBtn"
			})	
	);
	this.addElement(new Button(id+"_btnCancel",		
			{"caption":"Отмена",
			"onClick":function(){
				self.m_onClose.call(self,WindowQuestion.RES_CANCEL);
			},
			"attrs":{
				"title":"отменить"},
			"className":"viewBtn"
			})	
	);
	
}
extend(Confirm_View,ControlContainer);