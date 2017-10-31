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
function Kladr_View(id,options){
	options.className = options.className||"form-group";
	Kladr_View.superclass.constructor.call(this,
		id,"div",options);
		
	this.m_controller = new Kladr_Controller(new ServConnector(HOST_NAME));
	var self = this;
	
	var cont=new ControlContainer(uuid(),"div",{className:get_bs_col()+"6"});
	
	//Регион
	this.m_ctrlRegion = new EditObject(id+"_region",
		{"labelCaption":"Регион:",
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
		{"labelCaption":"Район:","name":"raion",
		"attrs":{"title":"Район"},
		"winObj":options.winObj,
		"noSelect":true,
		"noOpen":true,		
		"minLengthForQuery":1,
		"lookupController":this.m_controller,
		"lookupMethodId":"get_raion_list",
		"lookupModelId":"Kladr_Model",		
		"lookupValueFieldId":"full_name",
		"patternParamId":"pattern",
		"lookupKeyFieldIds":["raion_code"],				
		"keyFieldIds":["raion_code"],
		"events":{
			"focus":function(){
				var pm = self.m_controller.getPublicMethodById("get_raion_list");
				pm.setParamValue("region_code",self.m_ctrlRegion.getAttr("fkey_region_code"));				
			}
		}		
		}
	);
	cont.addElement(this.m_ctrlRaion);

	//Нас пункт
	this.m_ctrlNasPunkt = new EditObject(id+"_naspunkt",
		{"labelCaption":"Населенный пункт:","name":"naspunkt",
		"attrs":{"title":"Населенный пункт"},
		"winObj":options.winObj,
		"noSelect":true,
		"noOpen":true,		
		"minLengthForQuery":1,
		"lookupController":this.m_controller,
		"lookupMethodId":"get_naspunkt_list",
		"lookupModelId":"Kladr_Model",		
		"lookupValueFieldId":"full_name",
		"patternParamId":"pattern",
		"lookupKeyFieldIds":["naspunkt_code"],				
		"keyFieldIds":["naspunkt_code"],
		"events":{
			"focus":function(){
				var pm = self.m_controller.getPublicMethodById("get_naspunkt_list");
				pm.setParamValue("region_code",self.m_ctrlRegion.getAttr("fkey_region_code"));
				pm.setParamValue("raion_code",self.m_ctrlRaion.getAttr("fkey_raion_code"));
			}
		}		
		}
	);
	cont.addElement(this.m_ctrlNasPunkt);

	//Город
	this.m_ctrlGorod = new EditObject(id+"_gorod",
		{"labelCaption":"Город:","name":"gorod",
		"attrs":{"title":"Город"},
		"winObj":options.winObj,
		"noSelect":true,
		"noOpen":true,		
		"minLengthForQuery":2,
		"lookupController":this.m_controller,
		"lookupMethodId":"get_gorod_list",
		"lookupModelId":"Kladr_Model",		
		"lookupValueFieldId":"full_name",
		"patternParamId":"pattern",
		"lookupKeyFieldIds":["gorod_code"],				
		"keyFieldIds":["gorod_code"],
		"events":{
			"focus":function(){
				var pm = self.m_controller.getPublicMethodById("get_gorod_list");
				pm.setParamValue("region_code",self.m_ctrlRegion.getAttr("fkey_region_code"));
				pm.setParamValue("raion_code",self.m_ctrlRaion.getAttr("fkey_raion_code"));
			}
		}		
		}
	);
	cont.addElement(this.m_ctrlGorod);
	
	this.addElement(cont);

	var cont=new ControlContainer(uuid(),"div",{className:get_bs_col()+"6"});
	
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
				var np_code = self.m_ctrlNasPunkt.getAttr("fkey_naspunkt_code");
				if (np_code&&np_code.length&&np_code!="null"){
					pm.setParamValue("naspunkt_code",np_code);
					pm.setParamValue("gorod_code",null);
				}
				else{
					pm.setParamValue("naspunkt_code",null);
					pm.setParamValue("gorod_code",self.m_ctrlGorod.getAttr("fkey_gorod_code"));
				}
			}
		}		
		}
	);
	cont.addElement(this.m_ctrlUlitza);
	
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
extend(Kladr_View,ControlContainer);
