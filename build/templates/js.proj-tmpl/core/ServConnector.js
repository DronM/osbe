/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	ServConnector class
	Connects client with server
*/

/** Requirements
 * @requires common/functions.js
 * @requires core/ServResponse.js 
*/


/*
	Constructor
	host String - host Name
*/
function ServConnector(host,script){
	this.setHost(host);
	this.setScript(script || this.DEF_SCRIPT);
}
/* constants */
ServConnector.prototype.DEF_SCRIPT='index.php';
ServConnector.prototype.ER_NO_RET_FUNC='Return function is not defined.';

/* private members*/
ServConnector.prototype.m_host;
ServConnector.prototype.m_script;
ServConnector.prototype.m_http;

/* private fucntions*/

/* public functions*/
ServConnector.prototype.getHost = function(){
	return this.m_host;
}
ServConnector.prototype.setHost = function(host){
	this.m_host = host;
}
ServConnector.prototype.getScript = function(){
	return this.m_script;
}
ServConnector.prototype.setScript = function(script){
	this.m_script = script;
}
ServConnector.prototype.sendRequest = function(isGet,paramStr,async,
	onReturn,retContext,xmlResponse){
	xmlResponse = (xmlResponse==undefined)? true:xmlResponse;
	var request_id = uuid();
	async = (async==undefined)? true : async;
	if (onReturn==undefined){
		throw new Error(this.ER_NO_RET_FUNC);
	}
	//console.log(paramStr);
	//alert("ServConnector params="+paramStr);
	
	var self = this;
	this.m_http = createRequestObject();	
	
	var ready_func =
	function(){
		if (self.m_http.readyState == 4){
			var status = self.m_http.status;
			var error_n = (status>=200 && status<300)? 0:status;
			var error_s;
			var resp;
			if (error_n==0){
				//OK
				try{
					//alert("responseText="+self.m_http.responseText);
					if (xmlResponse){
						resp = new ServResponse();
						resp.parse(self.m_http.responseXML);
						error_n = resp.getRespResult();
						if (error_n!=0){
							error_s=resp.getRespDescr();
						}
					}
					else{
						resp = self.m_http.responseText;
						//alert(resp);
					}
				}
				catch(e){
					error_n = -1;
					error_s = e.message;
				}
			}
			else{
				error_s=self.m_http.statusText;
			}
			onReturn.call(retContext,
					error_n,error_s,resp,request_id);
		}	
	};
	
	if (async){
		this.m_http.onreadystatechange = ready_func;
	}
	
	if (isGet){
		//GET
		this.m_http.open("get", this.getHost() +
			this.getScript() +
			((paramStr)? "?"+paramStr:""),
			async);			
		this.m_http.send(null);	
	}
	else{
		//POST multipart/form-data
		var fd = new FormData();
		for (var par_id in paramStr){
			//console.log(par_id+"="+paramStr[par_id]);			
			fd.append(par_id,paramStr[par_id]);			
		}
		this.m_http.open("POST",
			this.getHost() +this.getScript(),
			async);
		//this.m_http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		this.m_http.send(fd)		
	}
	
	if (!async){
		ready_func.call(this);
	}	
	
	return request_id;
}
/* in case of Post is a structure of parameters!*/
ServConnector.prototype.sendPost = function(paramStr,async,onReturn,retContext,xmlResponse){
	return this.sendRequest(false,paramStr,async,onReturn,retContext,xmlResponse);
}
ServConnector.prototype.sendGet = function(paramStr,async,onReturn,retContext,xmlResponse){
	return this.sendRequest(true,paramStr,async,onReturn,retContext,xmlResponse);
}
