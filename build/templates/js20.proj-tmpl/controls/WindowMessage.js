/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2014

 * @requires core/CommonHelper.js
  
 * @class
 * @classdesc Message window
 
 */
function WindowMessage(){
	this.m_messages = [];

	this.m_window = null;
	this.m_model = null;
	this.m_bsCol = null;

}

WindowMessage.prototype.ID = "windowMessage";
WindowMessage.prototype.FLASH_TIME = 1000;
WindowMessage.prototype.BS_COL = 3;

WindowMessage.prototype.TP_ER = "danger";
WindowMessage.prototype.TP_WARN = "warning";
WindowMessage.prototype.TP_INFO = "info";
WindowMessage.prototype.TP_OK = "success";
	
/*@param object{
	@param string id,
	@param string subject,
	@param string content,
	@param string user_descr,
	@param string date_time,
	@param string message_type,
	@param int importance_level,
	@param bool require_view,
}	
*/
WindowMessage.prototype.m_messages;

WindowMessage.prototype.m_window;
WindowMessage.prototype.m_model;
WindowMessage.prototype.m_bsCol;
	
/*
@param {string} text
@param {int} [type=TP_MESSAGE]
@param {int} [timeout=0]
*/
WindowMessage.prototype.show = function(options){
	options = options || {};
	var mes_id = CommonHelper.uniqid();
	
	options.type = options.type || this.TP_INFO;
	
	this.m_messages.push({
		id:mes_id,
		date_time:DateHelper.time(),
		subject:null,
		content:options.text,
		user_descr:null,			
		message_type:options.type,
		importance_level:null,
		require_view:null
	});
	this.m_messages.sort(function (a, b) {
		if (a.date_time > b.date_time) {
			return 1;
		}
		if (a.date_time < b.date_time) {
			return -1;
		}
		return 0;
	});		
	
	this.m_bsCol = options.bsCol;
	this.toDOM();
	
	if (options.callBack){
		options.callBack();
	}
	
	return mes_id;
};
	
WindowMessage.prototype.toDOM = function(){
	var self = this;
	if (!this.m_window){
		var n = DOMHelper.getElementsByAttr("windowMessage", window.body, "class", true);
		if (!n.length){
			throw Error("Message window not found!");
		}
		if (!n[0].id){
			n[0].id = CommonHelper.uniqid();
		}
		this.m_window = new ControlContainer(n[0].id,"div",{"className":"panel panel-default windowMessage"});
		
		
		//,"value":"окно сообщений"
		var head = new ControlContainer(this.ID+":head","div",{"className":"panel-heading"});
		var head_cont = new ControlContainer(this.ID+":head-cont","div");
		head_cont.addElement(new ButtonCtrl(this.ID+":close",{
			"title":"закрыть",
			//"caption":"Закрыть",
			"glyph":"glyphicon-remove",
			"onClick":function(){
				self.m_messages = [];
				self.delDOM();
			}
		}));
		/*
		head_cont.addElement(new ButtonCtrl(this.ID+":clear",{
			"title":"очистить",
			"caption":"Очистить",
			"onClick":function(){
				self.m_messages = [];
				self.toDOM();
			}
		}));
		*/
		head.addElement(head_cont);
		
		this.m_content = new ControlContainer(this.ID+":content","div");//ul
		var body = new ControlContainer(this.ID+":body","div",{"className":"panel-body"});			
		body.addElement(this.m_content);
		
		this.m_window.addElement(head);
		this.m_window.addElement(body);
	}
	else{
		//this.m_window.setVisible(true);
	}
	this.m_window.setVisible(true);
	var dwin = CommonHelper.nd("windowData");
	if (dwin){
		DOMHelper.setAttr(dwin,"class",this.m_bsCol+(12-this.BS_COL));
	}				
	
	this.m_content.delDOM();
	this.m_content.clear();		
	
	var t = 0;
	for (var i=this.m_messages.length-1;i>=0;i--){
		//console.log(i+"="+this.m_messages[i].date_time);
		//
		var item_class = "alert alert-"+this.m_messages[i].message_type;
		item_class += (i==this.m_messages.length-1)? " flashit":"";
		
		var cont = new ControlContainer(this.m_messages[i].id,"p",{"className":item_class});
					
		if (i==this.m_messages.length-1){
			this.m_flashCont = cont;
			setTimeout(function(){
				DOMHelper.delClass(self.m_flashCont.getNode(),"flashit");
			}, this.FLASH_TIME);			
		}
		
		cont.addElement(new Control(this.m_messages[i].id+":head","DIV",
			{"value":DateHelper.format(this.m_messages[i].date_time,"H:i:s")
			}));				
		
		cont.addElement(new Control(this.m_messages[i].id+":title","DIV",
			{"value":this.m_messages[i].content
			}));				
		this.m_content.addElement(cont);
		t++;			
	}
	this.m_window.setClassName("panel panel-default windowMessage"+ ( (dwin)? (" "+this.m_bsCol+this.BS_COL):"") );
	this.m_window.toDOM();
	
};

WindowMessage.prototype.delDOM = function(){
	if (this.m_window){
		//this.m_window.setClassName("hidden");
		this.m_window.setVisible(false);
		var dwin = CommonHelper.nd("windowData");
		if (dwin){
			DOMHelper.setAttr(dwin,"class",this.m_bsCol+"12");
		}				
		
	}
}

