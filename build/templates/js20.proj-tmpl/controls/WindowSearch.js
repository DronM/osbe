/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2012,2014,2016,2017
 
 * @class
 * @classdesc Shows search form
 
 */
var WindowSearch = {
	RES_OK:0,
	RES_CANCEL:2,
	
	/**
	 * @param {Object} options
	 * @param {function} options.callBack
  	 * @param {string} options.text
  	 * @param {Control} [options.buttonClass=ButtonCmd]
  	 * @param {Array} options.columns descr/current/ctrlClass
	*/
	show:function(options){
		options = options || {};
		
		var self = this;
		
		this.m_callBack = options.callBack;
		
		this.m_modalId = "search-modal";
		
		var select_opts = [];
		for (var i=0;i<options.columns.length;i++){
			select_opts.push(new EditSelectOption(this.m_modalId+":where:"+(i+1),{
				"value":options.columns[i].id,
				"checked":options.columns[i].current,
				"descr":options.columns[i].descr
			}));
		}
				
		this.m_modal = new WindowFormModalBS(this.m_modalId,{
			"contentHead":this.HEAD_TITLE,
			"content":new ControlContainer(this.m_modalId+":cont","div",{
				"elements":[
					new EditString(this.m_modalId+":cont:search_str",{
						"labelCaption":this.STR_CAP,
						"placeholder":this.STR_PLACEHOLDER,
						"title":this.STR_TITLE,
						"maxlength":"500",
						"value":options.text,
						"focus":true
					}),
					
					new EditSelect(this.m_modalId+":where",{
						"labelCaption":this.PAR_WHERE_CAP,
						"elements":select_opts
					}),
					
					new EditRadioGroup(this.m_modalId+":how",{
						"labelCaption":this.PAR_HOW_CAP,
						"elements":[
							new EditRadio(this.m_modalId+":cont:on_beg",{
								"labelCaption":this.PAR_HOW_ON_BEG,
								"name":"how_opt",
								"value":"on_beg",
								"checked":false
								}),
							new EditRadio(this.m_modalId+":cont:on_part",{
								"labelCaption":this.PAR_HOW_ON_PART,
								"name":"how_opt",
								"value":"on_part",
								"checked":true
								}),
							new EditRadio(this.m_modalId+":cont:on_match",{
								"labelCaption":this.PAR_HOW_ON_MATCH,
								"name":"how_opt",
								"value":"on_match",
								"checked":false
								})
						]
					})
				]
			}),
			"controlOk": new ButtonCmd(this.m_modalId+":btn-ok",{
				"caption":this.BTN_FIND_CAP,
				"title":this.BTN_FIND_TITLE,
				"onClick":function(){
					self.m_modal.close(self.RES_OK);
				}
			}),
			"cmdCancel":true
		});
		
		this.m_modalOpenFunc = this.m_modal.open;
		this.m_modalCloseFunc = this.m_modal.close;
		
		this.m_modal.open = function(){
			self.addEvents();
			self.m_modalOpenFunc.call(self.m_modal);
			self.m_modal.m_footer.getElement("btn-ok").getNode().focus();
		}
		this.m_modal.close = function(res){
			self.delEvents();			
			
			var cont = self.m_modal.m_body.getElement("cont");
			self.m_callBack(res,{
				"search_str":cont.getElement("search_str").getValue(),
				"where":cont.getElement("where").getValue(),
				"how":cont.getElement("how").getValue()
			
			});
			self.m_modalCloseFunc.call(self.m_modal);
		}
		
		var btn_class = options.buttonClass || ButtonCmd;
		
		this.m_keyEvent = function(e){			
			e = EventHelper.fixKeyEvent(e);
			//console.log("this.m_keyEvent "+e.keyCode)
			if (self.keyPressEvent(e.keyCode,e)){
				e.preventDefault();
				return false;
			}
		};
		
		/*
		this.m_modal.m_footer.addElement(new btn_class(this.m_modalId+":btn-ok",{
			"caption":this.BTN_OK_CAP,
			"focus":true,
			"attrs":{
				"title": this.OK_TITLE,
				"tabindex":0
			},
			"onClick":function(){
				//self.m_callBack(self.RES_OK);
				//self.m_modal.close();
				self.m_modal.close(self.RES_OK);
			}
			})
		);

		this.m_modal.m_footer.addElement(new btn_class(this.m_modalId+":btn-cancel",{
			"caption":this.BTN_CANCEL_CAP,
			"attrs":{
				"data-dismiss":"modal",
				"title":this.CANCEL_TITLE,
				"tabindex":2
			},
			"onClick":function(){
				self.m_modal.close(self.RES_CANCEL);
			}				
		})
		);
		*/
		this.m_modal.open();
				
		return this.RES_NO;
	},
	
	addEvents:function(){
		EventHelper.add(window,'keydown',this.m_keyEvent,false);
	},
	
	delEvents:function(){
		EventHelper.del(window,'keydown',this.m_keyEvent,false);
	},
		
	keyPressEvent:function(keyCode,event){	
		var res=false;
		switch (keyCode){
			case 13: // return
				this.m_modal.close(this.RES_OK);
				res = true;
				break;
			case 27: // ESC
				this.m_modal.close(this.RES_CANCEL);
				res = true;
				break;												
		}		
		return res;
	}
	
}
