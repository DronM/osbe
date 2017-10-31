/* Copyright (c) 2016 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
/** Requirements
 * @requires 
*/

/* constructor
@param object options{

}
*/
function Command(id,options){
	if (typeof(id)=="object"){
		options = id;
		if (!options.id){
			options.id = options.publicMethod.getId();
		}
	}
	else{
		options = options || {};	
		options.id = id;
	}
	
	this.setId(options.id);
	this.setControl(options.control);
	this.setPublicMethod(options.publicMethod);
	this.setBindings(options.bindings || []);
	this.setAsync(options.async);
}

/* Constants */


/* private members */
Command.prototype.m_id;
Command.prototype.m_control;
Command.prototype.m_publicMethod;
Command.prototype.m_bindings;
Command.prototype.m_async;

/* protected*/


/* public methods */
Command.prototype.getPublicMethod = function(){
	return this.m_publicMethod;
}

Command.prototype.setPublicMethod = function(v){
	this.m_publicMethod = v;
}

Command.prototype.getBindings = function(){
	return this.m_bindings;
}

Command.prototype.setBindings = function(v){
	this.m_bindings = v;
}

Command.prototype.addBinding = function(binding){
	this.m_bindings.push(binding);
}

Command.prototype.getAsync = function(){
	return this.m_async;
}

Command.prototype.setAsync = function(v){
	this.m_async = v;
}

Command.prototype.getControl = function(){
	return this.m_control;
}

Command.prototype.setControl = function(v){
	this.m_control = v;
}


Command.prototype.getId = function(){
	return this.m_id;
}
Command.prototype.setId = function(v){
	this.m_id = v;
}
