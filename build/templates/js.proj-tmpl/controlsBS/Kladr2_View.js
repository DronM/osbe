/* Copyright (c) 2016 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires controls/ViewDialog.js
*/

/* constructor */
function Kladr2_View(id,options){
	options.className = options.className||"form-group";
	Kladr2_View.superclass.constructor.call(this,
		id,"div",options);
		
	this.m_controller = new Kladr_Controller(new ServConnector(HOST_NAME));
	var self = this;
	/*
	var cont = new ControlContainer(uuid(),"div",{className:"row"});
	var addr_id = uuid();
	this.m_ctrlAddress = new Control(addr_id,"div",{"className":"form-control "+get_bs_col()+"10"});
	cont.addElement(new Control(addr_id+":label","label",{
		"className":"control-label "+get_bs_col()+"2",
		"attrs":{"for":addr_id},
		"value":"Адрес:"
	}));
	cont.addElement(this.m_ctrlAddress);
	this.addElement(cont);
	*/
	var cont=new ControlContainer(uuid(),"div",{className:get_bs_col()+"6"});
	
	//Регион
	this.m_ctrlRegion = new EditObject(id+"_region",
		{"labelCaption":"Регион:",
		"attrs":{"title":"Наименование региона (можно не заполнять)"},
		"name":"region",
		"noSelect":true,
		"noOpen":true,
		"attrs":{"title":"Регион"},
		"winObj":options.winObj,
		"minLengthForQuery":1,
		"lookupController":this.m_controller,
		"lookupMethodId":"get_region_list",
		"lookupModelId":"Kladr_Model",		
		"lookupValueFieldId":"full_name",
		"patternParamId":"pattern",
		"lookupKeyFieldIds":["region_code"],
		"keyFieldIds":["region_code"]
		}
	);
	cont.addElement(this.m_ctrlRegion);
	
	//Район
	this.m_ctrlRaion = new EditObject(id+"_raion",
		{"className":"hidden","name":"raion",
		"noSelect":true,"noOpen":true,"noClear":true}
	);
	cont.addElement(this.m_ctrlRaion);

	//Нас пункт
	this.m_ctrlNasPunkt = new EditObject(id+"_naspunkt",
		{"className":"hidden","name":"naspunkt",
		"noSelect":true,"noOpen":true,"noClear":true}
	);
	cont.addElement(this.m_ctrlNasPunkt);

	//Город
	this.m_ctrlGorod = new EditObject(id+"_gorod",
		{"labelCaption":"Город (нас.пункт):","name":"gorod",
		"attrs":{"title":"Наименование город,деревни,села и т.д.","focus":true},
		"winObj":options.winObj,
		"noSelect":true,
		"noOpen":true,		
		"minLengthForQuery":2,
		"lookupController":this.m_controller,
		"lookupMethodId":"get_from_naspunkt",
		"lookupModelId":"Kladr_Model",		
		"lookupValueFieldId":"full_name",
		"patternParamId":"pattern",
		"lookupKeyFieldIds":["code"],				
		"keyFieldIds":["gorod_code"],
		"extraFields":["region_name","region_code","raion_name","raion_code"],
		"resultFieldId":"name",
		"onSelected":function(inputNode){
			//регион
			self.m_ctrlRegion.setValue(DOMHandler.getAttr(inputNode,"region_name"));
			self.m_ctrlRegion.setAttr("fkey_region_code",DOMHandler.getAttr(inputNode,"region_code"));
			self.m_ctrlGorod.setAttr("fkey_code",DOMHandler.getAttr(inputNode,"region_code"));
			//район
			self.m_ctrlRaion.setValue(DOMHandler.getAttr(inputNode,"raion_name"));
			self.m_ctrlRaion.setAttr("fkey_raion_code",DOMHandler.getAttr(inputNode,"raion_code"));
			//город
			//self.m_ctrlGorod.setAttr("fkey_gorod_code",DOMHandler.getAttr(inputNode,"fkey_code"));
		}
		/*,
		"events":{
			"focus":function(){
				var pm = self.m_controller.getPublicMethodById("get_from_naspunkt");
				pm.setParamValue("region_code",self.m_ctrlRegion.getAttr("fkey_region_code"));
			}
		}*/		
		}
	);
	cont.addElement(this.m_ctrlGorod);
	
	//Улица
	this.m_ctrlUlitza = new EditObject(id+"_ulitza",
		{"labelCaption":"Улица:","name":"ulitza",
		"attrs":{"title":"Улица"},
		"winObj":options.winObj,
		"noSelect":true,
		"noOpen":true,		
		"minLengthForQuery":1,
		"lookupController":this.m_controller,
		"lookupMethodId":"get_ulitsa_list",
		"lookupModelId":"Kladr_Model",		
		"lookupValueFieldId":"full_name",
		"patternParamId":"pattern",
		"lookupKeyFieldIds":["ulitza_code"],
		"keyFieldIds":["ulitza_code"],
		"events":{
			"focus":function(){
				var pm = self.m_controller.getPublicMethodById("get_ulitsa_list");
				pm.setParamValue("region_code",self.m_ctrlRegion.getAttr("fkey_region_code"));
				pm.setParamValue("raion_code",self.m_ctrlRaion.getAttr("fkey_raion_code"));
				pm.setParamValue("naspunkt_code",null);
				pm.setParamValue("gorod_code",self.m_ctrlGorod.getAttr("fkey_gorod_code"));
			}
		}		
		}
	);
	cont.addElement(this.m_ctrlUlitza);
	
	this.addElement(cont);

	var cont=new ControlContainer(uuid(),"div",{className:get_bs_col()+"6"});
		
	//Дом
	this.m_ctrlDom = new EditString(id+"_dom",
		{"labelCaption":"Дом:","name":"dom",
		"attrs":{"title":"Дом"},
		"winObj":options.winObj,
		"noSelect":true,
		"noOpen":true
		}
	);
	cont.addElement(this.m_ctrlDom);

	//Корпус
	this.m_ctrlKorpus = new EditString(id+"_korpus",
		{"labelCaption":"Корпус:","name":"korpus",
		"attrs":{"title":"Корпус"},
		"winObj":options.winObj,
		"noSelect":true,
		"noOpen":true
		}
	);
	cont.addElement(this.m_ctrlKorpus);

	//Квартира
	this.m_ctrlKvartira = new EditString(id+"_kvartira",
		{"labelCaption":"Квартира:","name":"kvartira",
		"attrs":{"title":"Квартира"},
		"winObj":options.winObj,
		"noSelect":true,
		"noOpen":true
		}
	);
	cont.addElement(this.m_ctrlKvartira);
	
	this.addElement(cont);
}
extend(Kladr2_View,ControlContainer);

