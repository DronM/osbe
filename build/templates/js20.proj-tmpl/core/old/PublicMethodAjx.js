/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends PublicMethod
 * @requires core/extend.js
 * @requires core/PublicMethod.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {namespace} options
 * @param {ControllerAjx} options.controller
 */
function PublicMethodAjx(id,options){
	options = options || {};	
	
	if (!options.controller){
		throw Error(CommonHelper.format(this.ER_NO_CONTROLLER, Array(id)));
	}
		
	this.setRequestType(options.requestType);
	this.setAsync(options.async);
	
	PublicMethodAjx.superclass.constructor.call(this,id,options);
}
extend(PublicMethodAjx,PublicMethod);

/* Constants */


/* private members */
PublicMethodAjx.prototype.m_requestType;
PublicMethodAjx.prototype.m_sync;


/* protected*/


/* public methods */
PublicMethodAjx.prototype.getRequestType = function(){
	this.m_requestType;
}
PublicMethodAjx.prototype.setRequestType = function(v){
	this.m_requestType = v;
}

PublicMethodAjx.prototype.getAsync = function(){
	this.m_async;
}
PublicMethodAjx.prototype.setAsync = function(v){
	this.m_async = v;
}

PublicMethodAjx.prototype.download = function(viewId){
	//arguments to fields
	this.getController().download(this.getId(),viewId);
}
PublicMethodAjx.prototype.openHref = function(viewId,winParams){
	this.getController().openHref(this.getId(),viewId,winParams);
}

PublicMethodAjx.prototype.run = function(options){
	this.getController().run(this.getId(),options);
}
