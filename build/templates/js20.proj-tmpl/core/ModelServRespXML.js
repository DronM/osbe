/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc Server response class with two fields result int(0 or error code) and descr (error description)
 
 * @param {string} data Model data as a string
 */

function ModelServRespXML(data){
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
extend(ModelServRespXML,ModelObjectXML);

ModelServRespXML.prototype.result;
ModelServRespXML.prototype.descr;

ModelServRespXML.prototype.setData = function(data){
	ModelServRespXML.superclass.setData.call(this,data);
	
	this.result = this.getFieldValue("result");
	this.descr = this.getFieldValue("descr");
}
