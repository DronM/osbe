/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc Basic application class
 
 * @param {string} id - html tag id
 * @param {Object} options
 * @param {string} options.host
 * @param {string} options.bsCol
 * @param {Object} options.servVars
 * @param {string} options.constantXMLString  - XML data for model  
 * @param {string} options.locale 
 */
function App(id,options){

	this.setId(id);
	
	options = options || {};	
	
	options.host = options.host || "";
	
	this.setHost(options.host);
	this.setScript(options.script);
	
	this.m_servVars = options.servVars || {};
	
	var con_opts = {
		"host":options.host
	};
	var con;
	if (this.m_servVars.token && this.m_servVars.token.length){
		con_opts.accessToken = this.m_servVars.token;
		con_opts.refreshToken = this.m_servVars.tokenr;
		con = new ServConnectorSecure(con_opts);
	}
	else{
		con = new ServConnector(con_opts);
	}
	this.setServConnector(con);
	
	this.m_constantManager = new ConstantManager({"XMLString":options.constantXMLString});
	
	this.m_cashData = {};
	this.m_openedForms = {};
	
	//this.m_templates = options.templates || {};
	this.m_templateParams = {};
	
	this.setPaginationClass(options.paginationClass || GridPagination);
}

/* Constants */

App.prototype.DEF_dateEditMask = "99/99/9999";
App.prototype.DEF_dateFormat = "d/m/Y";

App.prototype.DEF_dateTimeEditMask = "99/99/9999 99:99:99";
App.prototype.DEF_dateTimeFormat = "d/m/Y H:i:s";

App.prototype.DEF_phoneEditMask = "+7-(999)-999-99-99";
App.prototype.DEF_timeEditMask = "99:99";
App.prototype.DEF_timeFormat = "H:i:s";

App.prototype.DEF_LOCALE = "ru";

App.prototype.VERSION = "2.1.005";

/* private members */
App.prototype.m_id;
App.prototype.m_host;
App.prototype.m_script;
App.prototype.m_bsCol;
App.prototype.m_winClass;
App.prototype.m_servVars;
App.prototype.m_constantManager;
App.prototype.m_servConnector;
App.prototype.m_dateEditMask;
App.prototype.m_dateFormat;
App.prototype.m_dateTimeEditMask;
App.prototype.m_dateTimeFormat;
App.prototype.m_timeFormat;

App.prototype.m_phoneEditMask;
App.prototype.m_timeEditMask;

App.prototype.m_locale;
App.prototype.m_cashData;

App.prototype.m_openedForms;

App.prototype.m_templates;
App.prototype.m_templateParams;

App.prototype.m_paginationClass;

/* protected*/


/* public methods */
App.prototype.setHost = function(host){
	this.m_host = host;
}

App.prototype.getHost = function(){
	return this.m_host;
}

App.prototype.setScript = function(v){
	this.m_script = v;
}

App.prototype.getScript = function(){
	return this.m_script;
}

App.prototype.getBsCol = function(v){
	return window.getBsCol(v);
}

App.prototype.setWinClass = function(winClass){
	this.m_winClass = winClass;
}

App.prototype.getWinClass = function(winClass){
	return this.m_winClass;
}

App.prototype.getServVars = function(){
	return this.m_servVars;
}

App.prototype.getServVar = function(id){
	return this.m_servVars[id];
}

App.prototype.getConstantManager = function(){
	return this.m_constantManager;
}

App.prototype.getServConnector = function(){
	return this.m_servConnector;
}

App.prototype.setServConnector = function(v){
	this.m_servConnector = v;
}

/**/
App.prototype.getId = function(){
	return this.m_id;
}

App.prototype.setId = function(id){
	this.m_id = id;
}

App.prototype.setDateEditMask = function(v){
	this.m_dateEditMask = v;
}
App.prototype.getDateEditMask = function(){
	return (this.m_dateEditMask)? this.m_dateEditMask : this.DEF_dateEditMask;
}

App.prototype.setDateTimeEditMask = function(v){
	this.m_dateTimeEditMask = v;
}
App.prototype.getDateTimeEditMask = function(){
	return (this.m_dateTimeEditMask)? this.m_dateTimeEditMask : this.DEF_dateTimeEditMask;
}

App.prototype.setDateFormat = function(v){
	this.m_dateFormat = v;
}
App.prototype.getDateFormat = function(){
	return (this.m_dateFormat)? this.m_dateFormat : this.DEF_dateFormat;
}

App.prototype.setDateTimeFormat = function(v){
	this.m_dateTimeFormat = v;
}
App.prototype.getDateTimeFormat = function(){
	return (this.m_dateTimeFormat)? this.m_dateTimeFormat : this.DEF_dateTimeFormat;
}

App.prototype.setTimeFormat = function(v){
	this.m_timeFormat = v;
}
App.prototype.getTimeFormat = function(){
	return (this.m_timeFormat)? this.m_timeFormat : this.DEF_timeFormat;
}

App.prototype.setPhoneEditMask = function(v){
	this.m_phoneEditMask = v;
}
App.prototype.getPhoneEditMask = function(){
	return (this.m_phoneEditMask)? this.m_phoneEditMask : this.DEF_phoneEditMask;
}
App.prototype.setTimeEditMask = function(v){
	this.m_timeEditMask = v;
}
App.prototype.getTimeEditMask = function(){
	return (this.m_timeEditMask)? this.m_timeEditMask : this.DEF_timeEditMask;
}

App.prototype.getLocale = function(){
	return this.m_servVars["locale_id"] || this.DEF_LOCALE;
}

App.prototype.formatError = function(erCode,erStr){
	return (erStr + (erCode)? (", code:"+erCode):"");
}

App.prototype.getCashData = function(id){
	return this.m_cashData[id];
}
App.prototype.setCashData = function(id,val){
	this.m_cashData[id] = val;
}

App.prototype.getOpenedForms = function(){
	return this.m_openedForms;
}

App.prototype.addOpenedForm = function(id,form){
	this.m_openedForms[id] = form;
}
App.prototype.delOpenedForm = function(id){
	delete this.m_openedForms[id];
}

App.prototype.numberFormat = function(val,prec){
	return CommonHelper.numberFormat(val, prec, CommonHelper.getDecimalSeparator(), " ");
}

App.prototype.addTemplate = function(id,tmpl){
	this.m_templates[id] = tmpl;
}
App.prototype.getTemplate = function(id){
	return this.m_templates[id];
}
App.prototype.setTemplate = function(id,v){
	this.m_templates[id] = v;
}

App.prototype.getPaginationClass = function(id){
	return this.m_paginationClass;
}
App.prototype.setPaginationClass = function(v){
	this.m_paginationClass = v;
}

App.prototype.showMenuItem = function(c,f,t,extra){
	window.setGlobalWait(true);
	
	var self = this;
	
	var par = {"c":c,"v":"ViewXML"};
	if (f)par.f=f;
	
	if (extra){
		var par_ar = extra.split("&");
		for (var i=0;i<par_ar.length;i++){
			var par_pair = par_ar[i].split("=");
			if (par_pair.length==2){
				par[par_pair[0]] = par_pair[1];
			}
		}
	}
	this.m_storedTemplate = this.getTemplate(t) ||
		{
			"id":t,
			"template":null,
			"dataModelId":null,
			"variantStorage":null
		}
	;
	
	par.t=t;
	/*
	if (!this.m_storedTemplate.template){
		par.t=t;
	}
	else if(this.m_storedTemplate.variantStorage && this.m_storedTemplate.variantStorage.model){
		//need filter!!!	
	}
	*/
	
	this.getServConnector().sendGet(
		par,
		false,
		function(eN,eS,resp){
			if (eN!=0){
				window.setGlobalWait(false);
				window.showError(eS);
			}
			else{				
				self.renderContentXML(resp);
				window.setGlobalWait(false);
			}
		},
		"xml"
	);
	
	return false;
}

App.prototype.renderContentXML = function(resp){
	//var t0 = performance.now();
	try{
		var data_n = CommonHelper.nd("windowData");
		if (!data_n)return;

		if (this.m_view){
			this.m_view.delDOM();
			delete this.m_view;
		}

		//remove all child nodes
		while (data_n.firstChild) {
			data_n.removeChild(data_n.firstChild);
		}	
	
		var v_opts = {"models":{}};
		var resp_models = resp.getModels();
		
		for (var m_id in resp_models){
			//console.log("m_id="+m_id)
			var sys_model = resp_models[m_id].getAttribute("sysModel");
			if (sys_model=="1" && resp_models[m_id].getAttribute("templateId")){
				// && !this.m_storedTemplate.template
				v_opts.template = resp_models[m_id].innerHTML;
				//this.m_storedTemplate.template = resp_models[m_id].innerHTML;
				//v_opts.template = this.m_storedTemplate.template;
				/*
				for(var i=0;i<resp_models[m_id].childNodes.length;i++){
					data_n.append(resp_models[m_id].childNodes[i]);
				}
				*/
			}
			else if (sys_model=="1"){
			
			}
			else{
				var model_constr = eval(m_id);
				v_opts.models[m_id] = new model_constr({"data":resp.getModelData(m_id)});
			}
		}	
		this.m_storedTemplate.variantStorage = {"name":this.m_storedTemplate.id,"model":null};
		if (v_opts.models.VariantStorage_Model){
			this.m_storedTemplate.variantStorage.model = v_opts.models.VariantStorage_Model;
			this.m_storedTemplate.variantStorage.model.getRow(0);
		}
		
		//this.setTemplate(this.m_storedTemplate.id,this.m_storedTemplate);
		
		v_opts.variantStorage = this.m_storedTemplate.variantStorage;
		/*
		if (this.m_storedTemplate.template){
			data_n.innerHTML = this.m_storedTemplate.template;
		}
		*/
		var view = eval(this.m_storedTemplate.id+"_View");
		this.m_view = new view(this.m_storedTemplate.id,v_opts);
		this.m_view.toDOM(data_n);
		
	}
	catch(e){
		//window.showError(e.message);
		window.onerror(e.message,"App.js",369,1);
	}
	
	//var t1 = performance.now();
	//console.log("renderContentXML took " + (t1 - t0) + " milliseconds.")
	
	return false;
}

App.prototype.showAbout = function(){
	window.setGlobalWait(true);
	var contr = new About_Controller(this);
	contr.run("get_object",{
		"t":"About",
		"ok":function(resp){
			var v = new About_View("About_View",{
				"template":resp.getModelData("About-template").innerHTML,
				"models":{"About_Model":new About_Model({"data":resp.getModelData("About_Model")})}
			});
			window.setGlobalWait(false);
			WindowAbout.show(v);
		},
		"fail":function(){
			window.setGlobalWait(false);
		}
	})	
}
