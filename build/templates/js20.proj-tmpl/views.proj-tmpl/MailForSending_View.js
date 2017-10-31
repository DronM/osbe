/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc
	
 * @param {string} id view identifier
 * @param {namespace} options
 * @param {namespace} options.models All data models
 * @param {namespace} options.variantStorage {name,model}
 */	
function MailForSending_View(id,options){	

	options = options || {};
	
	options.enabled = false;
	
	Bank_View.superclass.constructor.call(this,id,options);
		
	var self = this;

	this.addElement(new ClientNameEdit(id+":bik",{
		"labelCaption":this.LB_CAP_BIK
	}));	

	this.addElement(new ClientNameEdit(id+":name",{
		"labelCaption":this.LB_CAP_NAME
	}));	

	this.addElement(new ClientNameEdit(id+":gor",{
		"labelCaption":this.LB_CAP_CITY
	}));	

	this.addElement(new ClientNameEdit(id+":gr_descr",{
		"labelCaption":this.LB_CAP_GROUP
	}));	

	this.addElement(new ClientNameEdit(id+":korshet",{
		"labelCaption":this.LB_CAP_BANK_ACC
	}));	
	this.addElement(new ClientNameEdit(id+":adres",{
		"labelCaption":this.LB_CAP_ADDRESS
	}));	
	
	//****************************************************
	var contr = new MailForSending_Controller(options.app);
	
	//read
	this.setReadPublicMethod(contr.getPublicMethod("get_object"));
	this.m_model = options.models.MailForSending_Model;
	this.setDataBindings([
		new DataBinding({"control":this.getElement("bik"),"model":this.m_model}),
		new DataBinding({"control":this.getElement("name"),"model":this.m_model}),
		new DataBinding({"control":this.getElement("korshet"),"model":this.m_model}),
		new DataBinding({"control":this.getElement("gor"),"model":this.m_model}),
		new DataBinding({"control":this.getElement("gr_descr"),"model":this.m_model})
	]);	
}
extend(MailForSending_View,ViewObjectAjx);
