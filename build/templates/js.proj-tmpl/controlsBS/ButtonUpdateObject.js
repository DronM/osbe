/* Copyright (c) 2015 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
  * @requires common/EventHandler.js
  * @requires controls/ButtonOpen.js
*/

/* constructor */
function ButtonUpdateObject(id,options){
	options = options || {};
	var self = this;
	options.attrs = options.attrs||{};
	options.attrs.title = options.attrs.title||"изменить запись";
	options.image = options.image||{
		"src":"img/cat/cat_update.jpg",
		"alt":"изм"
	};
	
	/*binds
	содержит структуру 
		ключ - поле контроллера
		значение - контрол на формы
	*/	
	this.m_binds=options.binds||{};
	this.m_oldKeyControls = options.oldKeyControls||{};
	this.m_controller = options.controller;
	this.m_methodId = options.methodId||this.m_controller.METH_UPDATE;
	
	var self = this;
	
	options.onClick = options.onClick ||
	function(event){		
		var params = {};
		for(var param_id in self.m_binds){
			params[param_id] = self.m_binds[param_id].getValue();
		}	
		//old keys
		for(var id in self.m_oldKeyControls){
			var ctrl = self.m_oldKeyControls[id];
			var fid = ctrl.getFieldId();
			params["old_"+id] = DOMHandler.getAttr(ctrl.getNode(),"last_fkey_"+fid);			
		}		
		var selfself = self;
		self.m_controller.run(self.m_methodId,{
			"params":params,
			"func":function(resp){
				WindowMessage.show({
					"text":"Запись изменена.",
					"type":WindowMessage.TP_MESSAGE,
					"callBack":function(){
						for(var id in selfself.m_oldKeyControls){
							var ctrl = selfself.m_oldKeyControls[id];
							var fid = ctrl.getFieldId();
							ctrl.setFieldValue(fid,
								DOMHandler.getAttr(ctrl.getNode(),"last_fkey_"+fid)
							);
						}
					}
					
				});
			}
		})
	};

	ButtonUpdateObject.superclass.constructor.call(
		this,id,options);
}
extend(ButtonUpdateObject,ButtonOpen);

ButtonUpdateObject.prototype.addBind = function(contrParam,ctrl){
		this.m_binds[contrParam] = ctrl;
}
ButtonUpdateObject.prototype.addOldKeyControl = function(fieldId,ctrl){
	this.m_oldKeyControls[fieldId] = ctrl;
}