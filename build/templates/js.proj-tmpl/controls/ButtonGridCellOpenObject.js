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
function ButtonGridCellOpenObject(id,options){
	options = options || {};
	var self = this;
	options.attrs = options.attrs||{};
	options.attrs.title = options.attrs.title||"открыть";
	options.onClick = options.onClick ||
		function(event){
			event = EventHandler.fixMouseEvent(event);			
			var tr = DOMHandler.getParentByTagName(event.target,"tr");
			var keys = {};
			var key_count = 0;
			for (var i=0;i<options.keyFieldIds.length;i++){
				var el = DOMHandler.getElementsByAttr(options.keyFieldIds[i],tr,"field_id",true,"td");
				if (el&&el.length){
					keys[options.lookupKeyFieldIds[i]] = el[0].childNodes[0].nodeValue;
				}
				key_count++;
			}			
			
			if (key_count==0){
				return;//no key value set
			}
				
			self.m_form = new WIN_CLASS({
				"caption":"Справочник"
				});
			self.m_form.open();
			var editViewObj = 
			new options.objectView(
				self.getId()+"EditView",
				{"onClose":function(res){
						self.m_form.close();
						//node.focus();
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

	ButtonGridCellOpenObject.superclass.constructor.call(
		this,id,options);
}
extend(ButtonGridCellOpenObject,ButtonOpen);

ButtonGridCellOpenObject.prototype.m_winObj;
ButtonGridCellOpenObject.prototype.DEF_IMAGE = "img/cat/cat_edit.png";
ButtonGridCellOpenObject.prototype.DEF_CLASS = "ctrlBtn ctrlGridCellOpen";