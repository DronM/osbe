/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc
	
 * @param {string} id view identifier
 * @param {namespace} options
 */	
function DOCCommands(id,options){

	options = options || {};	
	
	this.m_detailOnSelect = options.detailOnSelect;
	//this.m_viewId = options.viewId;
	
	//this.m_detailController = options.detailController;
	
	if (options.detailFillWinClass){
		var self = this;
		this.m_controlDetailFill = new ButtonSelectRef(id+":cmdDetailFill",
			{"caption":this.CTRL_DETFILL_CAP,
			"title":this.CTRL_DETFILL_TITLE,
			"multySelect":true,
			"onSelect":function(model){
					self.onSelected(model);
			},
			"winClass":options.detailFillWinClass
			}
		);		
	}	
	DOCCommands.superclass.constructor.call(this,id,options);
	
}
extend(DOCCommands,GridCommandsAjx);

/* Constants */


/* private members */

/* protected*/
DOCCommands.prototype.addControls = function(){
	DOCCommands.superclass.addControls.call(this);
	
	if (this.m_controlDetailFill)this.addElement(this.m_controlDetailFill);
}

/* public methods */
DOCCommands.prototype.onSelected = function(model){
	this.m_detailOnSelect.call(this,model,1);
	
	//quant request
	/*
	var self = this;
	this.m_modal = new WindowFormModalBS(this.getId()+":modal",{
		"content":new QuantEdit_View(this.getId()+":modal:body:qedit",{
			"defValue":1,
			"app":this.getApp()
		}),
		"headerClassName":"modal-header alert-info",
		"onClickOk":function(){
			self.m_modal.close();
			self.doSelected(model,self.m_modal.m_body.getElement("qedit").getElement("quant").getValue());			
			self.m_detailOnSelect.call(this,model,self.m_modal.m_body.getElement("qedit").getElement("quant").getValue())
		},
		"cmdCancel":true,
		"app":this.getApp()
	});
	this.m_modal.open();
	*/
}
/*
DOCCommands.prototype.doSelected = function(model,q){
	var contr = new this.m_detailController(this.getApp());
	var pm = contr.getPublicMethod("insert");
	pm.setFieldValue("view_id", this.m_viewId);
	pm.setFieldValue("material_id", model.getFieldValue("id"));
	pm.setFieldValue("quant", q);
	pm.run({"async":false});
	this.m_grid.onRefresh();
}
*/
