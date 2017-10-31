/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc inpage Modal Form
 
 * @extends ControlContainer
 
 * @requires core/extend.js
 * @requires controls/ControlContainer.js     
  
 * @param {string} id - html tag id
 * @param {namespase} options
 * @param {string} [options.ControlContainer=modal]
 * @param {string} [options.headerClassName=modal-header]
 * @param {Control|string} options.contentHead 
 * @param {Control} options.content
 * @param {Control} options.contentFoot
 * @param {bool} [options.cmdOk=false]
 * @param {Control} options.controlOk
 * @param {string} options.controlOkCaption
 * @param {string} options.controlOkTitle  
 * @param {function} options.onClickOk   
 * @param {bool} [options.cmdCancel=false]
 * @param {Control} options.controlCancel
 * @param {string} options.controlCancelCaption
 * @param {string} options.controlCancelTitle   
 * @param {function} options.onClickCancel
 
 */
function WindowFormModalBS(id,options){
	options = options || {};	
	
	//options.template = WindowFormModalBS_tmpl;
	options.className = options.className || "modal";//fade
	options.attrs = options.attrs||{};
	options.attrs.role = "dialog";
	
	WindowFormModalBS.superclass.constructor.call(this,id,"div",options);	
	
	this.m_dialog = new ControlContainer(id+"_dial","div",{className:"modal-dialog"});
	this.m_content = new ControlContainer(id+"_cont","div",{className:"modal-content"});
	
	this.m_header = new ControlContainer(id+"_head","div",{className: (options.headerClassName || "modal-header") });
	this.m_header.addElement(new Control(id+"_close","button",{
		className:"close",
		attrs:{"data-dismiss":"modal","aria-label":"Close"}
	}));
	this.m_header.addElement(new Control(null,"button",{
		"attrs":{
			"type":"button",
			"class":"close",
			"data-dismiss":"modal",
			"aria-hidden":"true"
		},
		"value":"×"
	}));
	if (options.contentHead){
		if (typeof(options.contentHead)=="object"){
			this.m_header.addElement(options.contentHead);
		}
		else{
			this.m_header.addElement(new Control(id+":head:label","h4",{
				"className":"modal-title",
				"value":options.contentHead
			}));
		}
	}
	
	this.m_body = new ControlContainer(id+":body","div",{className:"modal-body"});
	if (options.content){
		this.m_body.addElement(options.content);
	}
	
	this.m_footer = new ControlContainer(id+":footer","div",{className:"modal-footer"});
	if (options.contentFoot){
		this.m_footer.addElement(options.contentFoot);
	}
	
	var self = this;
	
	if (options.cmdOk || options.controlOk || options.onClickOk){
		this.m_footer.addElement(options.controlOk ||
			new ButtonCmd(id+":btn-ok",{
					"caption":options.controlOkCaption || this.BTN_OK_CAP,
					"title":options.controlOkTitle || this.BTN_OK_TITLE,
					"onClick":options.onClickOk
			})
		);
	}

	if (options.cmdCancel || options.controlCancel || options.onClickCancel){
		this.m_footer.addElement(options.controlCancel ||
			new ButtonCmd(id+":btn-cancel",{
					"caption":options.controlCancelCaption || this.BTN_CANCEL_CAP,
					"title":options.controlCancelTitle || this.BTN_CANCEL_TITLE,
					"onClick":options.onClickCancel || function(){
						self.close();
					}
			})
		);
	}
	
	this.m_content.addElement(this.m_header);
	this.m_content.addElement(this.m_body);
	this.m_content.addElement(this.m_footer);
	
	this.m_dialog.addElement(this.m_content);
}
extend(WindowFormModalBS,ControlContainer);

WindowFormModalBS.prototype.m_header;
WindowFormModalBS.prototype.m_body;
WindowFormModalBS.prototype.m_foot;

WindowFormModalBS.prototype.toDOM = function(parent){	

	WindowFormModalBS.superclass.toDOM.call(this,parent);	
	
	this.m_dialog.toDOM(this.getNode());
	$(this.getNode()).on('shown.bs.modal', function () {
		$('[autofocus]', this).focus();
	});
	
	$(this.getNode()).modal({
		show:true,
		keyboard:true
	});
}

WindowFormModalBS.prototype.delDOM = function(){	
	$(this.getNode()).modal("hide");
	this.m_dialog.delDOM();
	WindowFormModalBS.superclass.toDOM.call(this);			
}

WindowFormModalBS.prototype.open = function(){	
	this.toDOM(document.body);
}
WindowFormModalBS.prototype.close = function(){	
	this.delDOM();
}
WindowFormModalBS.prototype.getContentParent = function(){
	return this.m_body.getNode();
}
WindowFormModalBS.prototype.setCaption = function(caption){}
WindowFormModalBS.prototype.setFocus = function(){}
