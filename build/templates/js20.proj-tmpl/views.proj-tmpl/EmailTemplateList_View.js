/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends
 * @requires core/extend.js  

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {namespace} options
 * @param {string} options.className
 */
function EmailTemplateList_View(id,options){
	options = options || {};	
	
	EmailTemplateList_View.superclass.constructor.call(this,id,options);
	
	var model = options.models.EmailTemplateList_Model;
	var contr = new EmailTemplate_Controller();
	
	var constants = {"doc_per_page_count":null};
	window.getApp().getConstantManager().get(constants);
	
	var pagClass = window.getApp().getPaginationClass();
	
	var popup_menu = new PopUpMenu();
	
	this.addElement(new GridAjx(id+":grid",{
		"model":model,
		"keyIds":["id"],
		"controller":contr,
		"editInline":true,
		"editWinClass":null,
		"popUpMenu":popup_menu,
		"commands":new GridCmdContainerAjx(id+":grid:cmd",{
			"cmdInsert":false,
			"cmdCopy":false,
			"cmdDelete":false,
			"cmdEdit":true
		}),
		"head":new GridHead(id+"-grid:head",{
			"elements":[
				new GridRow(id+":grid:head:row0",{
					"elements":[
						new GridCellHead(id+":grid:head:email_type",{
							"columns":[
								new EnumGridColumn_email_types("email_type",{"field":model.getField("email_type")})
							],
							"sortable":true
						}),
					
						new GridCellHead(id+":grid:head:template",{
							"columns":[
								new GridColumn("template",{"field":model.getField("template")})
							]
						}),
						new GridCellHead(id+":grid:head:comment_text",{
							"columns":[
								new GridColumn("comment_text",{"field":model.getField("comment_text")})
							]
						}),
						new GridCellHead(id+":grid:head:mes_subject",{
							"columns":[
								new GridColumn("mes_subject",{"field":model.getField("mes_subject")})
							]
						}),
						new GridCellHead(id+":grid:head:fields",{
							"columns":[
								new GridColumn("fields",{"field":model.getField("fields")})
							]
						})
						
					]
				})
			]
		}),
		"pagination":new pagClass(id+"_page",
			{"countPerPage":constants.doc_per_page_count.getValue()}),		
		
		"autoRefresh":false,
		"refreshInterval":0,
		"rowSelect":false,
		"focus":true
	}));		
}
extend(EmailTemplateList_View,ViewAjx);

/* Constants */


/* private members */

/* protected*/


/* public methods */

