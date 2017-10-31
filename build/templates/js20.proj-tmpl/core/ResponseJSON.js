/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017
 
 * @class
 * @classdesc Response as JSON

 * @requires core/extend.js
 * @requires core/Response.js
 
 * @param {string|Object} resp
 */
function ResponseJSON(resp){
	ResponseJSON.superclass.constructor.call(this,resp);
}
extend(ResponseJSON,Response);

ResponseJSON.prototype.getInitResponse = function(){
	return {"models":[]};
}

ResponseJSON.prototype.setResponse = function(resp){
	var o;	
	if (typeof(resp)=="string"){
		o = CommonHelper.unserialize(resp);
	}
	else{
		o = resp;
	}
	ResponseJSON.superclass.setResponse.call(this,o);
	
	if (o)this.m_models = o.models;	
}
