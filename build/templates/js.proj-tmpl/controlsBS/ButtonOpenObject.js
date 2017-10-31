/* Copyright (c) 2012 
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
function ButtonOpenObject(id,options){
	options = options || {};
	var self = this;
	options.attrs = options.attrs||{};
	options.attrs.title = options.attrs.title||"открыть";
	
	options.glyph = "glyphicon-pencil";
	
	options.onClick = options.onClick ||
		function(event){
			event = EventHandler.fixMouseEvent(event);
			//поиск INPUT
			var node = event.target.parentNode.parentNode.previousSibling;
			
			var KEY_PREF = "fkey_";
			var KEY_PREF_LEN = 5;
			var keys = {};
			var key_count = 0;
			if (node.attributes){
				for (var i=0;i<options.keyFieldIds.length;i++){
					if (node.attributes[KEY_PREF+options.keyFieldIds[i]]!=undefined
					&& node.attributes[KEY_PREF+options.keyFieldIds[i]].nodeValue!=undefined
					&& node.attributes[KEY_PREF+options.keyFieldIds[i]].nodeValue!=''
					&& node.attributes[KEY_PREF+options.keyFieldIds[i]].nodeValue!='undefined'
					){
						keys[options.lookupKeyFieldIds[i]]=
							node.attributes[KEY_PREF+options.keyFieldIds[i]].nodeValue;
						key_count++;
					}
				}
			}
			if (key_count==0){
				return;//no key value set
			}
				
			self.m_form = new WIN_CLASS({"caption":"Справочник"});
			self.m_form.open();
			var editViewObj = 
			new options.objectView(
				self.getId()+"EditView",
				{"onClose":function(res){
						self.m_form.close();
						node.focus();
					},
				"readController":options.controller,
				"readModelId":options.modelId,
				"connect":options.controller.getServConnector(),
				"winObj":self.m_form
				}			
			);
			for (var key_id in keys){
				editViewObj.setReadIdValue(
					key_id,keys[key_id]
				);
			}			
			self.m_form.setWidth(editViewObj.getFormWidth());
			self.m_form.setHeight(editViewObj.getFormHeight());
			self.m_form.setCaption(editViewObj.getFormCaption());
			editViewObj.toDOM(self.m_form.getContentParent());
			editViewObj.readData();	
			self.m_form.setFocus();
	};

	ButtonOpenObject.superclass.constructor.call(
		this,id,options);
}
extend(ButtonOpenObject,ButtonOpen);

ButtonOpenObject.prototype.m_winObj;
