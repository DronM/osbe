/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc

 * @requires core/CommonHelper.js
  
 * @param {namespace} options
 * @param {ServConnector} options.servConnector
 */
 
function Controller(options){

	this.m_publicMethods = options.publicMethods || {};
}

/* constants */


/* private members */
Controller.prototype.m_publicMethods;

/* private methods */
Controller.prototype.getId = function(){
	return this.constructor.toString().match(/function (\w*)/)[1];
}

Controller.prototype.publicMethodExists = function(id){
	return (this.m_publicMethods[id]!=undefined);
}

/* public methods */
Controller.prototype.addPublicMethod = function(pm){
	this.m_publicMethods[pm.getId()] = pm;
}

Controller.prototype.checkPublicMethod = function(id){
	if (!this.publicMethodExists(id)){
		throw new Error(CommonHelper.format(this.ER_NO_METHOD,Array(id,this.getId())));
	}
	return true;
}
Controller.prototype.getPublicMethod = function(id){
	this.checkPublicMethod(id);
	return this.m_publicMethods[id];
}

Controller.prototype.getPublicMethods = function(){
	return this.m_publicMethods;
}

Controller.prototype.run = function(meth,options){
	this.getPublicMethod(meth).run(options);
}

