/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc

 * @requires core/extend.js
 * @requires core/ModelXML.js   
 
 * @param {string} id
 * @param {namespace} options
 */
function ModelObjectJSON(id,options){
	ModelObjectJSON.superclass.constructor.call(this,id,options);
}
extend(ModelObjectJSON,ModelJSON);

ModelObjectJSON.prototype.setData = function(data){
	ModelObjectJSON.superclass.setData.call(this,data);
	
	this.getNextRow();
}
