/* Copyright (c) 2012 
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
function Controller(id,servConnector){
	this.setId(id);
	this.setServConnector(servConnector);
	this.m_publicMethods = {};
}
/* constants */
Controller.prototype.ER_NO_METHOD = "Public method %s not found.";

/* private members */
Controller.prototype.m_servConnector;
Controller.prototype.m_id;
Controller.prototype.m_publicMethods;

/* private methods */
Controller.prototype.publicMethodExists = function(id){
	return (this.m_publicMethods[id]!=undefined);
}

/* public methods */
Controller.prototype.addPublicMethod = function(pm){
	this.m_publicMethods[pm.getId()] = pm;
}
Controller.prototype.checkPublicMethod = function(id){
	if (!this.publicMethodExists(id)){
		throw new Error(format(this.ER_NO_METHOD,Array(id))+" Controller:"+this.getId());
	}
	return true;
}
Controller.prototype.getPublicMethodById = function(id){
	this.checkPublicMethod(id);
	return this.m_publicMethods[id];
}

Controller.prototype.getServConnector = function(){
	return this.m_servConnector;
}
Controller.prototype.setServConnector = function(servConnector){
	this.m_servConnector = servConnector;
}
Controller.prototype.getId = function(){
	return this.m_id;
}
Controller.prototype.setId = function(id){
	this.m_id = id;
}

Controller.prototype.runPublicMethod = function(methodName,
	paramObj,async,retFunc,retCont,retOnError,xmlResponse,
	isGet){
	isGet = (isGet==undefined)? true:isGet;
	xmlResponse = (xmlResponse==undefined)? true:xmlResponse;
	var pm = this.getPublicMethodById(methodName);
	paramObj = paramObj || {};
	//set method params from name:value object
	for (var name in paramObj){
		pm.getParamById(name).setValue(paramObj[name]);		
	};
	var self = this;
	var param_str,con_func;
	var conn = this.getServConnector();
	if (isGet){
		param_str = this.getQueryString(pm);
		con_func = conn.sendGet;
	}
	else{
		con_func = conn.sendPost;
		param_str = this.getQueryStruc(pm);
	}
	this.m_resp = null;
	con_func.call(conn,
		param_str,async,
		function(errCode,errStr,resp,requestId){
			if (errCode!=0){
				if (retOnError){
					retOnError.call(retCont,resp,errCode,errStr);
				}
				else{
					throw new Error(errStr);
				}
			}
			else if (retFunc){
				self.m_resp = requestId;
				retFunc.call(retCont,resp,requestId);
			}
			else{				
				self.m_resp = resp;
			}
		},
		this,xmlResponse);
	return this.m_resp;
}
Controller.prototype.run = function(methId,options){
debugger
	options = options || {};
	var def_err_func = function(resp,errCode,errStr){
		WindowMessage.show({"text":errStr,"type":WindowMessage.TP_ER});
	}	
	var params = options.params || {};
	var async = (options.async==undefined)? true:options.async;
	var retFunc = options.func || null;
	var retCont = options.cont || null;
	var retOnError = options.err || def_err_func;
	var xml = (options.xml==undefined)? true:options.xml;	
	var isGet = (options.get==undefined)? true:options.get;	
	
	if (options.errControl){
		options.errControl.setValue("");
		retOnError = function(resp,errCode,errStr){
			options.errControl.setValue(errStr);
		}
	}
	
	return this.runPublicMethod(methId,params,async,retFunc,
			retCont,retOnError,xml,isGet);
}
Controller.prototype.getQuery = function(publicMethod,resultString){
	/* validation */
	var params_result;
	if (resultString){
		params_result = "";
	}
	else{
		params_result = {};
	}
	var param_pare;
	var params = publicMethod.getParams();
	var error="";
	var this_error;
	var valid=true;
	for (var param in params){
		if (params[param]){
			if (!params[param].isValid(this_error)){
				valid = false;
				error +=(error=="")? "":" ";
				error +=this_error;
			}
			else{
				if (resultString){
					param_pare = params[param].getQueryString();
					if (param_pare){
						params_result+=(params_result=="")? "":"&";
						params_result+= param_pare;
					}
				}
				else{
					if (!params[param].isEmpty()){
						params_result[params[param].getId()] =
							params[param].getValueForQuery();
					}
				}
			}
		}
	};
	
	if (!valid){
		throw new Error(error);
	}
	return params_result;
}
Controller.prototype.getQueryString = function(publicMethod){
	return this.getQuery(publicMethod,true);
}
Controller.prototype.getQueryStruc = function(publicMethod){
	return this.getQuery(publicMethod,false);
}
