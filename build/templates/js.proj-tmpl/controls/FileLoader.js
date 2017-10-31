/* Copyright (c) 2015 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires common/DOMHandler.js
*/

/* constructor */
function FileLoader(id,options){	
	options = options || {};
	options.className = options.className || this.DEF_CLASS;
	FileLoader.superclass.constructor.call(this,id,
		"form",options);
		
	this.m_files = options.files;
	
	this.m_controller = options.controller;
	this.m_methodId = options.methodId;
	this.m_getMethodId = options.getMethodId;
	
	this.m_onFileUploadEnd = options.onFileUploadEnd;
	this.m_onFileDiwnload = options.onFileDiwnload;
}
extend(FileLoader,Control);

/* constants */
FileLoader.prototype.DEF_CLASS = "ctrlFlLoad";

FileLoader.prototype.toDOM = function(parent){
	FileLoader.superclass.toDOM.call(this,parent);
	this.m_filesCtrl = {};
	this.m_filesCapCtrl = {};
	
	var self = this;
	
	for (var id in this.m_files){
		//download
		(new Button(id+"_download",{
			"caption":"Скачать",
			"onClick":function(){
				if (self.m_onFileDownload){
					self.m_onFileDownload.call(self);
				}
				else{
					top.location.href = HOST_NAME+"index.php?"+
						self.m_controller.getQueryString(
							self.m_controller.getPublicMethodById(self.m_getMethodId)
							);
				}
			}
			})
		).toDOM(this.m_node);
		
		var file = this.m_files[id];
		//заголовок		
		if (file.caption!=undefined){
			this.m_filesCapCtrl[id] = new Control(file.name+"_cap","div",{
				"value":file.caption});
			this.m_filesCapCtrl[id].toDOM(this.m_node);		
		}
		this.m_filesCtrl[id] = new Control(file.name,"input",{
			"attrs":{"type":"file","name":file.name}});
		this.m_filesCtrl[id].toDOM(this.m_node);
	}
		
	this.m_submitCtrl = new Control(id+"_submit","input",{
		"attrs":{"type":"submit","value":"Загрузить"}});
	this.m_submitCtrl.toDOM(this.m_node);
		
	this.m_node.onsubmit = function() {
		var params={};
		for (var id in self.m_filesCtrl){
			params[self.m_filesCtrl[id].m_node.name] = self.m_filesCtrl[id].m_node.files[0];
		}
		
		self.m_controller.run(self.m_methodId,{
			"async":true,
			"get":false,
			"params":params,
			"func":function(resp){
				if (self.m_onFileUploadEnd){
					self.m_onFileUploadEnd.call(self,resp);
				}
			}
		});
	  return false;
	}
	
}
FileLoader.prototype.removeDOM = function(){
	/*
	for (var ctrl in this.m_filesCtrl){
		ctrl.removeDOM();
	}	
	delete this.m_filesCtrl;
	for (var ctrl in this.m_filesCapCtrl){
		ctrl.removeDOM();
	}	
	delete this.m_filesCapCtrl;
	
	this.m_submitCtrl.removeDOM();
	*/
	FileLoader.superclass.removeDOM.call(this);
}