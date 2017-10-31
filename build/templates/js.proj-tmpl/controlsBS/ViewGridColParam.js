/* Copyright (c) 2016 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
/** Requirements
 * @requires 
 * @requires core/extend.js  
*/

/* constructor
@param string id
@param object options{

}
*/
function ViewGridColParam(id,options){
	options = options || {};	

	ViewGridColParam.superclass.constructor.call(this,id,"div",options);
	
	this.m_colCheckId = options.colCheckId;
	this.m_paramId = options.paramId;
	this.m_colCheckCaption = options.colCheckCaption;	
	
	var head = new GridHead();
	var row = new GridRow(id+"_row1");	
	
	this.addHeadCells(row);
		
	head.addElement(row);
	
	//body
	var body = new GridBody();
	options.viewParams = options.viewParams || {};
	
	this.m_onAfterSave = options.viewParams.onAfterSave;
	
	if (options.viewParams.paramValue){		
		
		this.m_initVal = options.viewParams.paramValue;
		this.m_template = options.viewParams.template;
		
		for (var i=0;i<options.viewParams.paramValue.length;i++){
			var fieldStruc = options.viewParams.paramValue[i];
			
			var row = new GridRow(this.getId()+"_row_"+fieldStruc.id,{
				"attrs":{"fieldId":fieldStruc.id}});
				
			this.addCells(row,fieldStruc);
			
			body.addElement(row);
		}
	}
	
	this.m_grid = new Grid(id+":grid",
		{"head":head,
		"body":body,
		"commandPanel":new RepFieldsCommands(id+"_cmd",{"noInsert":true,"noEdit":true,"noDelete":true,"noColumnManager":true}),
		"rowCommandPanelClass":null,
		"filter":null,
		"refreshInterval":0,
		"winObj":options.winObj
		}
	);
	
	this.m_errorCtrl = new ErrorControl(id+":error");
	this.addElement(this.m_errorCtrl);
	this.addElement(this.m_grid);
	
	var self = this;
	this.addElement(new ButtonCmd(id+":save",{
		"caption":"Применить",
		"attrs":{"title":"Применить изменения"},
		"onClick":function(){
			self.save();
		}
	}));
}
extend(ViewGridColParam,ControlContainer);

/* Constants */


/* private members */

/* protected*/


/* public methods */
ViewGridColParam.prototype.save = function(){
	var b = this.m_grid.getBody();
	var rows = b.getNode().getElementsByTagName("tr");
	var res = [];
	for (var r=0;r<rows.length;r++){		
		var id = rows[r].getAttribute("fieldId");
		var row = b.m_elements[this.getId()+"_row_"+id];
		
		this.saveRow(res,row,id);
		
	}
	
	var res_str = array2json(res);	
	if (array2json(this.m_initVal)!=res_str){
		var self = this;
		var contr = new TemplateParam_Controller(new ServConnector(HOST_NAME));
		contr.run("set_value",{
			"params":{"template":this.m_template,
				"param":this.m_paramId,
				"val":res_str
				},
			"errControl":this.m_errorCtrl,
			"func":function(resp){
				self.m_initVal = res;
				self.onAfterSave();
				self.m_errorCtrl.setValue("Изменения записаны!");				
			}
		});
	}
}

ViewGridColParam.prototype.onAfterSave = function(){	
	this.m_onAfterSave(this.m_initVal);
}
