/* Copyright (c) 2014 
	Andrey Mikhalevich, Katren ltd.
*/

/** Requirements
/* core/CommonHelper.js
/* controls/WindowFormModalBS.js
*/

/* constructor*/
var WindowMessage = {
	TP_ER:1,
	TP_WARN:2,
	TP_INFO:3,
	TP_OK:4,
	/*
	@param string text
	@param int type Default TP_MESSAGE
	@param int timeout Default 0
	*/
	show:function(options){
		options = options || {};
		var modal_id = CommonHelper.uniqid();
		
		options.type = options.type || this.TP_INFO;
		options.timeout = options.timeout || 0;
		
		var css_class;
		if (options.type==this.TP_ER){
			css_class = "alert-danger";
		}
		else if (options.type==this.TP_WARN){
			css_class = "alert-warning";
		}
		else if (options.type==this.TP_INFO){
			css_class = "alert-success";
		}
		else{
			css_class = "alert-info";
		}
		
		this.m_modal = new WindowFormModalBS(modal_id,{
			content:new Control(modal_id+":cont","div",{value:options.text}),
			headerClassName:"modal-header "+css_class
		});
		var self = this;
		var ok_func = function(){
			if (options.callBack) {
				options.callBack();
			}
			self.m_modal.close();
		};
		
		this.m_modal.m_footer.addElement(new ButtonCmd(modal_id+":btn-ok",{
			"caption":"ОК",
			"onClick":ok_func
			})
		);
		this.m_modal.open();
		
		if (options.timeout>0){
			var self = this;
			this.timeoutObj = window.setTimeout(function(){
				clearTimeout(self.timeoutObj);
				ok_func();
			},options.timeout);
		}
	}
}
