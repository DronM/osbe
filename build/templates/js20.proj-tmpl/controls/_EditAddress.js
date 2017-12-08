/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends
 * @requires core/extend.js  

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {namespace} options
 * @param {string} options.className
 */
function EditAddress(id,options){
	options = options || {};	
	
	options.tagName = "A";
	options.attrs = options.attrs || {};
	options.attrs.style = ((options.attrs.style)? options.attrs.style:"") + "cursor:pointer;";
	
	options.events = options.events || {};
	
	options.events.click = this.m_onClick;
	
	this.m_field = options.field;
	
	EditAddress.superclass.constructor.call(this,id,options);
}
extend(EditAddress,Edit);

/* Constants */


/* private members */

/* protected*/


/* public methods */

EditAddress.prototype.toDOM = function(parent){
	var id = this.getId();	
	
	this.m_container = new ControlContainer( ((id)? id+":cont" : null),this.m_contTagName,{
		"className":this.m_contClassName
	});	
	
	if (this.m_label && this.m_labelAlign=="left"){
		this.m_container.addElement(this.m_label);
	}

	this.m_container.toDOM(parent);
	
	EditAddress.superclass.toDOM.call(this,this.m_container.getNode());	
	
}

EditAddress.prototype.m_values;//JSON value

EditAddress.prototype.setValue = function(v){
	if (typeof v =="object"){
		this.m_values = v;
	}
	else{
	//console.log("V="+v)
		this.m_values = CommonHelper.unserialize(v);
	}
	
	var descr = "";
	if (this.m_values){
		if (this.m_values.region && !this.m_values.region.isNull()) descr+= ((descr=="")? "":", ") + this.m_values.region.getDescr();
		if (this.m_values.raion && !this.m_values.raion.isNull()) descr+= ((descr=="")? "":", ") + this.m_values.raion.getDescr();
		if (this.m_values.naspunkt && !this.m_values.naspunkt.isNull()) descr+= ((descr=="")? "":", ") + this.m_values.naspunkt.getDescr();
		if (this.m_values.gorod && !this.m_values.gorod.isNull()) descr+= ((descr=="")? "":", ") + this.m_values.gorod.getDescr();
		if (this.m_values.ulitsa && !this.m_values.ulitsa.isNull()) descr+= ((descr=="")? "":", ") + this.m_values.ulitsa.getDescr();
		if (this.m_values.dom) descr+= ((descr=="")? "":", ") + "д."+this.m_values.dom;
		if (this.m_values.korpus) descr+= ((descr=="")? "":", ") + "корп."+this.m_values.korpus;
		if (this.m_values.kvartira) descr+= ((descr=="")? "":", ") + "кв."+this.m_values.kvartira;
	}	
	this.getNode().textContent = descr;
}

EditAddress.prototype.getValue = function(val){
	return CommonHelper.serialize(this.m_values);
}

EditAddress.prototype.m_onClick = function(){
	this.m_view = new ViewKladr("AddrView:body:view",{
		"values":this.m_values,
		"template":window.getApp().getTemplate("ViewKladr")		
	});
	var self = this;
	this.m_form = new WindowFormModalBS("AddrView",{
		"cmdCancel":true,
		"controlCancelCaption":this.m_view.BTN_CANCEL_CAP,
		"controlCancelTitle":this.m_view.BTN_CANCEL_TITLE,
		"cmdOk":true,
		"controlOkCaption":this.m_view.BTN_OK_CAP,
		"controlOkTitle":this.m_view.BTN_OK_TITLE,
		"onClickCancel":function(){
			self.closeSelect();
		},		
		"onClickOk":function(){
			self.setValue(self.m_view.getValue());
			self.closeSelect();
		},				
		"content":this.m_view,
		"contentHead":this.m_view.CAPION
	});

	this.m_form.open();
	
}

EditAddress.prototype.closeSelect = function(){
	this.m_view.delDOM();
	this.m_form.close();
	delete this.m_view;
	delete this.m_form;
}
