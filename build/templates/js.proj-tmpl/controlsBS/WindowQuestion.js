/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
//ф
/** Requirements
*/

/* constructor */
var WindowQuestion = {
	RES_YES:0,
	RES_NO:1,
	RES_CANCEL:2,
	show:function(options){
		options = options || {};
		var yes = (options.yes!=undefined)? options.yes:true;
		var no = (options.no!=undefined)? options.no:true;
		var cancel = (options.cancel!=undefined)? options.cancel:true;
		var timeout = options.timeout || 0;
		
		this.m_callBack = options.callBack;
		
		this.m_modalId = uuid();
		this.m_modal = new WindowFormModalBS(this.m_modalId,{
			content:new Control(uuid(),"div",{value:options.text})
		});
		
		var self = this;
		if (yes){
			this.m_modal.m_footer.addElement(new ButtonCmd(uuid(),{
				"caption":"Да",
				"attrs":{"title":"ответить утвердительно"},
				"onClick":function(){
					self.m_callBack(self.RES_YES);
					self.m_modal.close();
				}
				})
			);
		}

		if (no){
			this.m_modal.m_footer.addElement(new ButtonCmd(uuid(),{
				"caption":"Нет",
				"attrs":{"title":"ответить отрицательно"},
				"onClick":function(){
					self.m_callBack(self.RES_NO);						
					self.m_modal.close();						
				}
				})
			);
		}
		
		if (cancel){
			this.m_modal.m_footer.addElement(new ButtonCmd(uuid(),{
				"caption":"Отмена",
				"attrs":{"data-dismiss":"modal","title":"отменить действие"}
				})
			);
		}
		this.m_modal.open();
				
		return this.RES_NO;
	}
}