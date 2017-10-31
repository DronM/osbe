/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc Basic Controller
 
 * @requires core/extend.js
 * @requires core/ServConnector.js 

 * @param {namespace} options
 * @param {string} options.host - Model identifier
 * @param {string} [options.script=this.DEF_SCRIPT]
 * @param {string} options.accessToken
 * @param {string} options.refreshToken
 * @param {boolean} [options.autoRefreshSession=true]  - TRUE if autorefresh is needed
 * @param {array} options.noTokenFuncs  - TRUE if autorefresh is needed
 */
function ServConnectorSecure(options){
	options = options || {};
	
	options.CORS = true;
	
	this.m_accessToken = options.accessToken;
	this.m_refreshToken = options.refreshToken;
	this.m_autoRefreshSession = (options.autoRefreshSession!=undefined)? options.autoRefreshSession:true;
	 
	ServConnectorSecure.superclass.constructor.call(this,options);
}
extend(ServConnectorSecure,ServConnector);

ServConnectorSecure.prototype.ERR_AUTH_EXP = 101;
ServConnectorSecure.prototype.REFRESH_FUNC = "login_refresh";
ServConnectorSecure.prototype.TOK_PAR = "token";
ServConnectorSecure.prototype.REFRESH_TOK_PAR = "refresh_token";

//Private
ServConnectorSecure.prototype.m_accessToken;
ServConnectorSecure.prototype.m_refreshToken;
ServConnectorSecure.prototype.m_autoRefreshSession;

/*
ServConnectorSecure.prototype.sendRequest = function(isGet,params,async,onReturn){
	
	ServConnectorSecure.superclass.sendRequest(this,isGet,params,async,onReturn);
}
*/
/*
	принимает Get/Post запросы и проверяет ответ на ошибку 101 - сессия истекла
	
	если есть такая ошибка - отправляем запрос get на refresh с ключом для обновления сессии
	при удаче, повторяем первоначальный запрос
	при ошибке - выходим на клиентскую вункцию
	Если ошибки авторизации нет - выходим на клиентскую вункцию
*/
/**
 * @param {boolean} isGet
 * @param {array} params
 * @param {boolean} async
 * @param {function} onReturn
 */
ServConnectorSecure.prototype.send = function(isGet,params,async,onReturn,retContentType){
	if (this.m_autoRefreshSession){
		var user_on_return = onReturn;
		
		params[this.TOK_PAR] = this.m_accessToken;
		
		var self = this;
		onReturn = function(errorN,errorS,resp,requestId){
			console.log("ServConnectorSecure.prototype.send.onReturn errorN="+errorN)
			if (errorN==self.ERR_AUTH_EXP){
				//session is expired
				var req_opts = {
					"c":"User_Controller",
					"f":self.REFRESH_FUNC,
					"v":"ViewXML",
					"token":self.m_accessToken
				};
				req_opts[self.REFRESH_TOK_PAR] = self.m_refreshToken;
				self.sendRequest(true,
					req_opts,
					async,
					function(errorN,errorS,resp,requestId){
						if (errorN==0){
							//no errors - update token and send the initial query
							//this.m_accessToken
							var m = new ModelServAuthXML(resp.getModelData("Auth_Model"));
							self.m_accessToken = m.access_token;
							self.m_refreshToken = m.refresh_token;
							
							params['token'] = self.m_accessToken;
							self.sendRequest(isGet,params,async,user_on_return);
						}
						else{
							//there is an error
							user_on_return(errorN,errorS,resp,requestId);
						}
					}
				);
			}
			else{
				//no token expiration error
				user_on_return(errorN,errorS,resp,requestId);
			}
		}
	}
	
	return this.sendRequest(isGet,params,async,onReturn,retContentType);
}

ServConnectorSecure.prototype.sendPost = function(params,async,onReturn,retContentType){
	return this.send(false,params,async,onReturn);
}
ServConnectorSecure.prototype.sendGet = function(params,async,onReturn,retContentType){
	return this.send(true,params,async,onReturn);
}
