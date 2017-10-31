/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc Server authentification model; is sent in login_refresh request
 
 * @param {DOMNode} data Model data as a DOMNode
 */

function ModelServAuthXML(data){
	ModelServAuthXML.superclass.constructor.call(this,	
	"Auth_Model",
	{"data":data,
	"fields":{
		"access_token":new FieldString("access_token"),
		"refresh_token":new FieldString("refresh_token"),
		"expires_in":new FieldInt("expires_in"),
		"time":new FieldInt("time")
		}
	});
	
}
extend(ModelServAuthXML,ModelSingleRowXML);

ModelServAuthXML.prototype.access_token;
ModelServAuthXML.prototype.refresh_token;
ModelServAuthXML.prototype.expires_in;
ModelServAuthXML.prototype.time;

ModelServAuthXML.prototype.setData = function(data){
	ModelServAuthXML.superclass.setData.call(this,data);
	
	this.getNextRow();
	this.access_token = this.getFieldValue("access_token");
	this.refresh_token = this.getFieldValue("refresh_token");
	this.expires_in = this.getFieldValue("expires_in");
	this.time = this.getFieldValue("time");		
}
