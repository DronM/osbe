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
function ButtonCall(id,options){
	options = options || {};
	options.image=options.image||
		{"src":this.DEF_IMG,"alt":"тел."};
	this.m_tel = options.tel;
	var self = this;
	options.className = "ctrlCall";
	options.onClick = options.onClick||function(){
		self.onClick();
	};
	options.attrs=options.attrs||{};
	options.attrs.title =options.attrs.title||"позвонить";
	
	ButtonCall.superclass.constructor.call(
		this,id,options);
}
extend(ButtonCall,Button);

ButtonCall.prototype.onClick = function(){
	if (this.m_tel&&SERV_VARS.TEl_EXT){
		if (this.m_tel==""){
			alert("Не задан номер телефона!");
		}
		//alert(SERV_VARS.TEl_EXT+"==>>"+this.m_tel);
		//return;
		var contr = new Caller_Controller(new ServConnector(HOST_NAME));
		contr.run("call",{
			"async":true,
			"params":{"tel":this.m_tel,"ext":SERV_VARS.TEl_EXT},
			"func":function(resp){
			}
		});
	}
}
ButtonCall.prototype.DEF_IMG = "img/common/tel.gif";