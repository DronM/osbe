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
function ButtonInsertObject(id,options){
	options = options || {};
	var self = this;
	options.attrs = options.attrs||{};
	options.attrs.title = options.attrs.title||"создать новую запись";
	options.image = options.image||{
		"src":"img/cat/cat_new.png",
		"alt":"нов"
	};
	
	/*binds
	содержит структуру 
		ключ - поле контроллера
		значение - контрол на формы
	*/
	this.m_binds=options.binds||{};
	this.m_controller = options.controller;
	this.m_methodId = options.methodId||this.m_controller.METH_INSERT;
	
	options.onClick = options.onClick ||
	function(event){		
		var pm = this.m_controller.getPublicMethodById(this.m_methodId);
		pm.setParamValue(this.m_controller.PARAM_RET_ID,"1");
		var params = {};
		for(var param_id in this.m_binds){
			params[param_id] = this.m_binds[param_id].getValue();
		}
		var self = this;
		this.m_controller.run(this.m_methodId,{
			"params":params,
			"func":function(resp){
				WindowMessage.show({
					"text":"Запись добавлена.",
					"type":WindowMessage.TP_MESSAGE,
					"callBack":function(){
						var m = resp.getModelById("LastIds",true);
						if (m.getNextRow()){
							for(var param_id in self.m_binds){
								self.m_binds[param_id].setFieldValue(null,m.getFieldValue("id"));
							}
						}						
					}
				});
			}
		})
	};

	ButtonInsertObject.superclass.constructor.call(
		this,id,options);
}
extend(ButtonInsertObject,ButtonOpen);

ButtonInsertObject.prototype.addBind = function(contrParam,ctrl){
		this.m_binds[contrParam] = ctrl;
}