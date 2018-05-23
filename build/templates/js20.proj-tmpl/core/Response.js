/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2010
 
 * @class
 * @classdesc Response object. Model container

 * @requires core/CommonHelper.js 
 
 * @param {string} resp - Server response
 */
function Response(resp){	
	this.m_models={};
	this.setResponse(resp);
}

/* private members */
Response.prototype.m_resp;
Response.prototype.m_models;

/* public */
Response.prototype.getInitResponse = function(){
}

Response.prototype.setResponse = function(resp){	
	this.m_resp = (resp)? resp:this.getInitResponse();
}

Response.prototype.modelExists = function(id){
	return (this.m_models[id])? true:false;
}

Response.prototype.setModelData = function(id,data){
	this.m_models[id] = data;
}

/**
 * @param {string} id model id
 * returns {XMLDocument|JSON}
 */
Response.prototype.getModelData = function(id){
	if (!this.m_models[id]){
		throw new Error(CommonHelper.format(this.ERR_NO_MODEL,[id]));
	}
	return this.m_models[id];	
}

Response.prototype.getModels = function(){
	return this.m_models;	
}

Response.prototype.getModel = function(id){
	if (this.modelExists(id) && window[id]){
		return new window[id]({"data":this.m_models[id]});
	}
}
