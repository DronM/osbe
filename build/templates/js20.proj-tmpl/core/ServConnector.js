/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc Basic application class

 * @param {namespace} options
 * @param {string} options.host
 * @param {string} [options.script=this.DEF_SCRIPT]
 * @param {boolean} [options.CORS=false] Cross origin resource sharing for Cross domain queries
 */
function ServConnector(options){
	options = options ||{};
	
	this.setHost(options.host || "");
	this.setScript(options.script || this.DEF_SCRIPT);
	this.setCORS((options.CORS!==undefined)? options.CORS:false);
	
	this.m_xhrStates = {		
		UNSENT:0, // начальное состояние
		OPENED:1, // вызван open
		HEADERS_RECEIVED:2, // получены заголовки
		LOADING:3, // загружается тело (получен очередной пакет данных)
		DONE:4 // запрос завершён				
	};
		
}

/* constants */
ServConnector.prototype.DEF_SCRIPT = "index.php";

ServConnector.prototype.ERR_AUTH = 100;
ServConnector.prototype.ERR_AUTH_NOT_LOGGED = 102;
ServConnector.prototype.ENCTYPES = {
	ENCODED:"application/x-www-form-urlencoded",
	MULTIPART:"multipart/form-data",
	TEXT:"text-plain"
};


/* private members*/
ServConnector.prototype.m_xhrStates;
ServConnector.prototype.m_CORS;
ServConnector.prototype.m_host;
ServConnector.prototype.m_script;
ServConnector.prototype.m_port;

/* private fucntions*/

/* public functions*/

/**
 * @public
 * @returns {boolean}
 */
ServConnector.prototype.getCORS = function(){
	return this.m_CORS;
}
/**
 * @public
 */
ServConnector.prototype.setCORS = function(v){
	this.m_CORS = v;
}

/**
 * @public
 * @returns {string} 
 */
ServConnector.prototype.getHost = function(){
	return this.m_host;
}
/**
 * @public
 * @param {string} host
 */
ServConnector.prototype.setHost = function(host){
	this.m_host = host;
}

/**
 * @public
 * @returns {string} 
 */
ServConnector.prototype.getScript = function(){
	return this.m_script;
}
/**
 * @public
 * @param {string} script
 */
ServConnector.prototype.setScript = function(script){
	this.m_script = script;
}

/**
 * @public
 * @returns {string}
 * @param {Object} params 
 */
ServConnector.prototype.queryParamsAsStr = function(params,encode){
	var paramStr = "";
	for (var par_id in params){
		paramStr+= (paramStr=="")? "":"&";
		paramStr+= par_id+"=";
		paramStr+= (encode)? encodeURIComponent(params[par_id]) : params[par_id];
	}
	return paramStr;
}

/**
 * @public
 * @param {boolean} isGet
 * @param {namespace} params
 * @param {boolean} [async=true]
 * @param {function} onReturn
 * @param {function} retContentType - expected return type in content-type
 * @param {string} [enctype=ENCODED] - post form encoding ENCODED || MULTIPART || TEXT
 */
ServConnector.prototype.sendRequest = function(isGet,params,async,onReturn,retContentType,enctype){
	this.m_requestId = CommonHelper.uniqid();
	async = (async==undefined)? true : async;
	
	var url = this.getHost()+this.getScript();
	var send_param;
	
	var xhr = (this.m_CORS===true)? CommonHelper.createCORS() : CommonHelper.createXHR();
	var self = this;
	xhr.onreadystatechange = function(){
		if (xhr.readyState == self.m_xhrStates.HEADERS_RECEIVED){
			//console.log("Status:"+xhr.status)
		}
		else if (xhr.readyState == self.m_xhrStates.DONE){
			//console.log("ServConnector.prototype.onStateChange DONE");
		
			var error_n;
			var error_s;
			var resp;
		
			if (xhr.status==0){
				error_s = self.ER_STATUS0;
				error_n = -1;
			}
			else{
				error_n = (xhr.status>=200 && xhr.status<300)? 0 : xhr.status;
				if (error_n==0){				
					var RESP_MODEL_ID = "ModelServResponse";
		
					//OK
					try{					
						var tr = xhr.getResponseHeader("content-type");
						//console.log("respType="+tr)
						if (tr && tr.indexOf("xml")>=0){
							//xml
							resp = new ResponseXML(xhr.responseXML);
							/** @ToDo resp.getModelNode */
							var m = new ModelServRespXML(resp.getModelData(RESP_MODEL_ID));
							error_n = m.result;
							error_s = m.descr;
						}
						else if (tr && tr.indexOf("json")>=0){
							//json
							resp = new ResponseJSON(xhr.responseText);
							var m = new ModelServRespJSON(resp.getModelData(RESP_MODEL_ID));
							error_n = m.result;
							error_s = m.descr;						
						}
						else{
							//text/html
							if (retContentType!=undefined && tr && tr.indexOf(retContentType)<0){

								//but something else has been requested 
								error_n = -1;
								error_s = xhr.responseText;
							}
							else{	
								resp = xhr.responseText;
							}
						}
					}
					catch(e){
						error_n = -1;
						error_s = e.message;
					}
				}
				else{
					error_s = xhr.statusText;
				}
			}
			if (error_n==self.ERR_AUTH_NOT_LOGGED){
				//fatal errors				
				//console.log("Fatal error trapped! Redirection")
				window.location = self.getHost() +self.getScript();
			}
		
			if (onReturn){
				onReturn.call(self,error_n,error_s,resp,self.m_requestId);
			}
		}		
	}
	
	
	if (isGet){
		//GET				
		url = url +"?"+ this.queryParamsAsStr(params,true);
		if (this.getCORS()){
			//async only
			xhr.open("GET",url);
		}
		else{
			xhr.open("GET",url,async);
		}
		send_param = null;
	}
	else{
		//POST
		enctype = enctype || this.ENCTYPES.ENCODED;		
		if (this.getCORS()){
			//async only
			xhr.open("POST",url);
		}
		else{
			xhr.open("POST",url,async);
		}
		if (enctype==this.ENCTYPES.ENCODED){
			xhr.setRequestHeader("Content-Type", enctype);
			send_param = this.queryParamsAsStr(params,true);
		}
		if (enctype==this.ENCTYPES.MULTIPART){
			if (typeof FormData !== 'undefined'){
				//xhr.setRequestHeader("Content-Type", enctype);+boundary Let browser handle it!
				send_param = new FormData();
				for (var par_id in params){
					if (params[par_id] && typeof params[par_id]=="object"){						
						//files
						for (var fi=0;fi<params[par_id].length;fi++){
							send_param.append(par_id+"[]",params[par_id][fi]);
						}
					}
					else{
						send_param.append(par_id,params[par_id]);
					}
				}
			}
			else{
				//no FormData
				var boundary = String(Math.random()).slice(2);
				var boundaryMiddle = '--' + boundary + '\r\n';
				var boundaryLast = '--' + boundary + '--\r\n';
				send_param = ['\r\n'];
				for (var key in params) {
					send_param.push('Content-Disposition: form-data; name="' + key + '"\r\n\r\n' + params[key] + '\r\n');
				}
				send_param = send_param.join(boundaryMiddle) + boundaryLast;
				xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);				
			}
		}
	}
	if (!this.getCORS && xhr.setRequestHeader){
		//does not work with CORS???
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	}
	xhr.send(send_param);	
	
	/*
	else if (isGet || (typeof FormData === 'undefined') ){
	else{
		//POST
		var fd = new FormData();
		for (var par_id in params){
			fd.append(par_id,encodeURIComponent(params[par_id]));
		}
		xhr.open("POST",url,async);
		xhr.send(fd)		
	}
	*/
	
	/*
	if (!async){
		this.onStateChange();
	}	
	*/
	return this.m_requestId;
}

/* in case of Post is a structure of parameters!*/
ServConnector.prototype.sendPost = function(params,async,onReturn,retContentType,enctype){	
//console.log("ServConnector.prototype.sendPost enctype="+enctype)
	return this.sendRequest(false,params,async,onReturn,retContentType,enctype);
}
ServConnector.prototype.sendGet = function(params,async,onReturn,retContentType){
	return this.sendRequest(true,params,async,onReturn,retContentType);
}
ServConnector.prototype.openHref = function(params,winParams){
	winParams = (winParams)? winParams:"location=0,menubar=0,status=0,titlebar=0";
	window.open(this.getHost() + this.getScript() +"?"+ this.queryParamsAsStr(params,true),
		"_blank",winParams
	); 
}
