/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017
 
 * @class
 * @classdesc Server response class with two fields result int(0 or error code) and descr (error description)
 
 * @param {string} data
 */
function ModelServRespJSON(data){
	ModelServRespXML.superclass.constructor.call(this,	
		"ModelServResponse",
		{"data":data,
		"fields":{
			"result":new FieldInt("result"),
			"descr":new FieldString("descr")
			}
		}
	);	
}
extend(ModelServRespJSON,ModelObjectJSON);

ModelServRespJSON.prototype.result;
ModelServRespJSON.prototype.descr;

ModelServRespJSON.prototype.setData = function(data){
	ModelServRespJSON.superclass.setData.call(this,data);
	
	this.result = this.getFieldValue("result");
	this.descr = this.getFieldValue("descr");
}
