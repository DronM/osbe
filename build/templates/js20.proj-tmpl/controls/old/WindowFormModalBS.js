/* Copyright (c) 2015 
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
function WindowFormModalBS(id,options){
	options = options || {};	
	options.className = options.className||"modal fade";
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
	
	this.m_body = new ControlContainer(id+":body","div",{className:"modal-body"});
	if (options.content){
		this.m_body.addElement(options.content);
	}
	
	this.m_footer = new ControlContainer(id+":footer","div",{className:"modal-footer"});
	
	var self = this;
	
	if (options.cmdOk || options.controlOk || options.onClickOk){
		this.m_footer.addElement(options.controlOk ||
			new ButtonCmd(id+":btn-ok",{
					"caption":this.BTN_OK_CAP,
					"title":this.BTN_OK_TITLE,
					"onClick":options.onClickOk
			})
		);
	}

	if (options.cmdCancel || options.controlCancel || options.onClickCancel){
		this.m_footer.addElement(options.controlCancel ||
			new ButtonCmd(id+":btn-cancel",{
					"caption":this.BTN_CANCEL_CAP,
					"title":this.BTN_CANCEL_TITLE,
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
	$(this.getNode()).modal({
		show:true,
		keyboard:true
	});
	
	//focus
	var first;
	var focused = false;
	
	for (var i=0;i<this.m_content.m_elements.length;i++)	{
		if (this.m_content.m_elements[i].getAttr("autofocus")){
			this.m_content.m_elements[i].getNode().focus();
			focused = true;
			break;
		}
		if (!first){
			first = this.m_body.m_elements[id];
		}
	}
	if (!focused && first){
		first.getNode().focus();
	}
	else if (this.m_footer){
		var ok = this.m_footer.getElement("btn-ok");		
		if(ok){
			ok.getNode().focus();
		}
	}
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
