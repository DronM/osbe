/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends
 * @requires core/extend.js  

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {Object} options
 * @param {string} options.className
 */
function Captcha(id,options){
	options = options || {};	
	
	options.required = true;
	
	this.m_keyLength = options.keyLength || this.DEF_KEYLENGTH;
	
	self = this;
	options.addElement = function(){
		this.addElement(new ButtonCtrl(id+":refresh",{
			"title":self.REFRESH_TITLE,
			"onClick":function(){
				self.refresh();
			}
		}));
		this.addElement(new Control(id+":img","IMG"));
		this.addElement(new Control(id+":key","INPUT",{			
			"attrs":{
				"required":"required",
				"type":"text",
				"maxlength":self.m_keyLength,
				"title":self.KEY_TITLE,
				"placeholder":self.KEY_PLACEHOLDER			
			}
		}));
		self.setErrorControl((options.errorControl!==undefined)? options.errorControl: ((self.m_html)? null:new ErrorControl(self.getId()+":error")) );
		this.addElement(self.getErrorControl());		
	}
	
	Captcha.superclass.constructor.call(this,id,"DIV",options);
}
extend(Captcha,ControlContainer);

/* Constants */
Captcha.prototype.DEF_KEYLENGTH = 6;

/* private members */
Captcha.prototype.m_keyLength;

/* protected*/


/* public methods */
Captcha.prototype.toDOM = function(parent){
	Captcha.superclass.toDOM.call(this,parent);
	this.refresh();
}

Captcha.prototype.setErrorControl = function(v){
	this.m_errorControl = v;
}
Captcha.prototype.getErrorControl = function(){
	return this.m_errorControl;
}

Captcha.prototype.getModified = function(){
	return true;
}

Captcha.prototype.setFromResp = function(resp){
	var m = new ModelObjectXML("Captcha_Model",{
		"fields":["img"],
		"data":resp.getModelData("Captcha_Model")
	});
	this.getElement("img").setAttr("src", "data:image;base64,"+m.getFieldValue("img"));
}

Captcha.prototype.refresh = function(){
	this.getElement("refresh").setEnabled(false);
	var self = this;
	(new Captcha_Controller()).run("get",{
		"ok":function(resp){
			self.setFromResp(resp);
		},
		"fail":function(resp,errCode,errStr){
			self.getErrorControl().setValue(errStr);
		},
		"all":function(){
			self.getElement("refresh").setEnabled(true);
		}
	});
}

Captcha.prototype.getValue = function(){
	var v = this.getElement("key").getNode().value;
	return (!v || !v.length)? null:v;
}

Captcha.prototype.setValid = function(){
	this.getErrorControl().clear();
}

Captcha.prototype.setNotValid = function(str){
	this.getErrorControl().setValue(str);
}

