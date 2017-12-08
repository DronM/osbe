/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends
 * @requires core/extend.js  

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 * @param {Control} options.viewClass
 * @param {string} options.viewTemplate
 * @param {string} options.headTitle
 * @param {function} options.formatValue
 */
function EditModalDialog(id,options){
	options = options || {};	
	
	this.m_viewClass = options.viewClass;
	this.m_viewTemplate = options.viewTemplate;
	this.m_headTitle = options.headTitle;
	
	var self = this;
	this.setFormatValue(
		options.formatValue ||
		function(val){
			return self.formatValue(val);
		}
	);
	
	options.tagName = "A";
	options.attrs = options.attrs || {};
	options.attrs.style = ((options.attrs.style)? options.attrs.style:"") + "cursor:pointer;";
	
	options.events = options.events || {};
	
	options.events.click = this.m_onClick;
	
	EditModalDialog.superclass.constructor.call(this,id,options);
}
extend(EditModalDialog,Edit);

/* Constants */


/* private members */

/* protected*/


/* public methods */

EditModalDialog.prototype.toDOM = function(parent){
	var id = this.getId();	
	
	this.m_container = new ControlContainer( ((id)? id+":cont" : null),this.m_contTagName,{
		"className":this.m_contClassName
	});	
	
	if (this.m_label && this.m_labelAlign=="left"){
		this.m_container.addElement(this.m_label);
	}

	this.m_container.toDOM(parent);
	
	EditModalDialog.superclass.toDOM.call(this,this.m_container.getNode());	
	
	if (this.m_buttons && !this.m_buttons.isEmpty()){
		this.m_buttons.toDOMAfter(this.getNode());
	}
}

EditModalDialog.prototype.m_valueJSON;//JSON value
EditModalDialog.prototype.m_viewClass;
EditModalDialog.prototype.m_viewTemplate;
EditModalDialog.prototype.m_headTitle;
EditModalDialog.prototype.m_formatValue;

EditModalDialog.prototype.setValue = function(v){
	if (typeof v =="object"){
		this.m_valueJSON = v;
	}
	else{
		this.m_valueJSON = CommonHelper.unserialize(v);
	}
	
	var v = this.m_formatValue(this.m_valueJSON);
	this.getNode().textContent = v
}

EditModalDialog.prototype.getValue = function(){
//console.log("EditModalDialog.prototype.getValue ")
//console.dir(this.m_valueJSON)
	return CommonHelper.serialize(this.m_valueJSON);
}

EditModalDialog.prototype.getValueJSON = function(){
	return this.m_valueJSON;
}

EditModalDialog.prototype.isNull = function(){
	var res = true;
	if (this.m_valueJSON || typeof(this.m_valueJSON)=="object" || !CommonHelper.isEmpty(this.m_valueJSON)){
		for (var id in this.m_valueJSON){
			if (this.m_valueJSON[id]!=undefined){
				res = false;
				break;
			}
		}
	}
	return res;
}

EditModalDialog.prototype.m_onClick = function(){
	this.m_view = new this.m_viewClass(this.getId()+":view:body:view",{
		"valueJSON":this.m_valueJSON,
		"template":window.getApp().getTemplate(this.m_viewTemplate)		
	});
	var self = this;
	this.m_form = new WindowFormModalBS(this.getId()+":form",{
		"cmdCancel":true,
		"controlCancelCaption":this.BTN_CANCEL_CAP,
		"controlCancelTitle":this.BTN_CANCEL_TITLE,
		"cmdOk":true,
		"controlOkCaption":this.BTN_OK_CAP,
		"controlOkTitle":this.BTN_OK_TITLE,
		"onClickCancel":function(){
			self.closeSelect();
		},		
		"onClickOk":function(){
			self.setValue(self.m_view.getValue());
			self.closeSelect();
		},				
		"content":this.m_view,
		"contentHead":this.m_headTitle
	});

	this.m_form.open();
	
}

EditModalDialog.prototype.closeSelect = function(){
	if (this.m_view){
		this.m_view.delDOM();
		delete this.m_view;
	}
	if (this.m_form){
		this.m_form.close();
		delete this.m_form;
	}		
}

EditModalDialog.prototype.setFormatValue = function(v){
	this.m_formatValue = v;
}
EditModalDialog.prototype.getFormatValue = function(){
	return this.m_formatValue;
}
EditModalDialog.prototype.formatValue = function(val){
	var res = "";
	for (var id in val){
		if (val[id] && typeof(val[id])=="object" && !val[id].isNull()){
			res+= ((res=="")? "":", ") + val[id].getDescr();
		}
		else if (val[id] && val[id]!=""){
			res+= ((res=="")? "":", ") + val[id];
		}
		
	}
	return res;	
}
