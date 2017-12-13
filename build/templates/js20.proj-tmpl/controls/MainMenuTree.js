/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends
 * @requires core/extend.js  

 * @class
 * @classdesc Main menu tree class, Relies on a specific MainMenuContent_Model
 
 * @param {string} id - Object identifier
 * @param {namespace} options
 * @param {string} options.className
 */
function MainMenuTree(id,options){
	options = options || {};	
	
	var self = this;
	
	options.editViewOptions = {
		"tagName":"LI",
		"columnTagName":"DIV",
		"onBeforeExecCommand":function(cmd,pm){
			pm.setFieldValue("viewdescr",self.m_editViewDescr);
		}
	};
	options.rootCaption = this.ROOT_CAP;
	options.model = new MainMenuContent_Model();
	options.className = "menuConstructor";
	options.controller = new MainMenuContent_Controller({"clientModel":options.model});
	
	options.commands = new GridCmdContainerAjx(id+":cmd",{
		"cmdColManager":false,
		"cmdExport":false,
		"cmdSearch":false,
		"cmdCopy":false,
		"cmdRefresh":false
	});
	
	options.head = new GridHead(id+":head",{
		"rowOptions":[{"tagName":"li"}],
		"elements":[
			new GridRow(id+":content-tree:head:row0",{
				"elements":[
					new GridCellHead(id+":content-tree:head:descr",{
						"className":window.getBsCol(6),
						"columns":[
							new GridColumn({
								"model":options.model,
								"field":options.model.getField("descr"),
								"cellOptions":{
									"tagName":"SPAN"									
								},
								"ctrlOptions":{									
									"labelCaption":this.LB_CAP_DESCR,
									"contTagName":"DIV",
									"labelClassName":"control-label "+window.getBsCol(2),
									"editContClassName":"input-group "+window.getBsCol(10)
								}
							}),
							new GridColumn({
								"field":options.model.getField("viewdescr"),
								"model":options.model,
								"cellOptions":{"tagName":"SPAN"},
								"ctrlClass":ViewEditRef,
								"ctrlBindField":options.model.getField("viewid"),
								"ctrlOptions":{
									"labelCaption":this.LB_CAP_VIEW,
									"contTagName":"DIV",
									"labelClassName":"control-label "+window.getBsCol(2),
									"editContClassName":"input-group "+window.getBsCol(10),
									"keyIds":["viewid"],
									"menuTree":this
								}								
							}),
							new GridColumn({
								"field":options.model.getField("glyphclass"),
								"model":options.model,
								"cellOptions":{
									"tagName":"SPAN"									
								},
								"ctrlOptions":{									
									"labelCaption":this.LB_CAP_GLYPHCLASS,
									"contTagName":"DIV",
									"labelClassName":"control-label "+window.getBsCol(2),
									"editContClassName":"input-group "+window.getBsCol(10)
								}
							}),
							
							new GridColumn({
								"field":options.model.getField("default"),
								"assocClassList":{"true":"glyphicon glyphicon-ok"},
								"model":options.model,
								"cellOptions":{"tagName":"SPAN"},
								"ctrlOptions":{
									"labelCaption":this.LB_CAP_DEFAULT,
									"contTagName":"DIV",
									"labelClassName":"control-label "+window.getBsCol(2),
									"editContClassName":"input-group "+window.getBsCol(1)									
								}								
							})
						]
					})
				]
			})
		]
	});
	
	MainMenuTree.superclass.constructor.call(this,id,options);
}
extend(MainMenuTree,TreeAjx);

/* Constants */


/* private members */

/* protected*/


/* public methods */
/*
row.m_drop.accept = function(dragObject) {
	var drop_id = CommonHelper.unserialize(this.element.getAttribute("keys")).id;
	var drag_id = CommonHelper.unserialize(dragObject.element.getAttribute("keys")).id;					
	console.log("FromId="+drag_id+" to Id="+drop_id)
	
	self.m_model.resetFields();
	self.m_model.m_fields.id.setValue(drag_id)
	var drag_row = self.m_model.recLocate(self.m_model.m_fields)[0];

	self.m_model.resetFields();
	self.m_model.m_fields.id.setValue(drop_id)					
	var drop_row = self.m_model.recLocate(self.m_model.m_fields)[0];
	
	drop_row.parentNode.insertBefore(drag_row,drop_row);
	if (self.m_model.getFieldValue("viewDescr")){
		//elem
		drop_row.parentNode.insertBefore(drag_row,drop_row);
	}
	else{
		//group
		DOMHelper.setParent(drag_row,drop_row);
	}
	self.onRefresh();
	
}			
*/
