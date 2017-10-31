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
function MailForSendingList_View(id,options){
	options = options || {};	
	
	MailForSendingList_View.superclass.constructor.call(this,id,options);
	
	MailForSendingList_View.superclass.constructor.call(this,id,options);
	
	var model = options.models.MailForSendingList_Model;
	var contr = new MailForSending_Controller();
	
	var constants = {"doc_per_page_count":null};
	window.getApp().getConstantManager().get(constants);
	
	var pagClass = window.getApp().getPaginationClass();
	
	var popup_menu = new PopUpMenu();
	
	this.addElement(new GridAjx(id+":grid",{
		"model":model,
		"keyIds":["id"],
		"controller":contr,
		"editInline":false,
		"editWinClass":MailForSending_Form,
		"popUpMenu":popup_menu,
		"commands":new GridCmdContainerAjx(id+":grid:cmd",{
			"cmdInsert":false,
			"cmdCopy":false,
			"cmdDelete":false
		}),
		"head":new GridHead(id+"-grid:head",{
			"elements":[
				new GridRow(id+":grid:head:row0",{
					"elements":[
						new GridCellHead(id+":grid:head:date_time",{
							"columns":[
								new GridColumnDateTime("date_time",{"field":model.getField("date_time")})
							],
							"sortable":true,
							"sort":"asc"
						}),
						new GridCellHead(id+":grid:head:subject",{
							"columns":[
								new GridColumn({"field":model.getField("subject")})
							],
							"sortable":true
						}),						
						new GridCellHead(id+":grid:head:from_addr",{
							"columns":[
								new GridColumn({"field":model.getField("from_addr")})
							],
							"sortable":true
						}),
						new GridCellHead(id+":grid:head:from_name",{
							"columns":[
								new GridColumn({"field":model.getField("from_name")})
							],
							"sortable":true
						}),
						new GridCellHead(id+":grid:head:to_addr",{
							"columns":[
								new GridColumn({"field":model.getField("to_addr")})
							],
							"sortable":true
						}),
						new GridCellHead(id+":grid:head:to_name",{
							"columns":[
								new GridColumn({"field":model.getField("to_name")})
							],
							"sortable":true
						}),
						new GridCellHead(id+":grid:head:sent_date_time",{
							"columns":[
								new GridColumnDateTime("sent_date_time",{"field":model.getField("sent_date_time")})
							],
							"sortable":true
						}),
						new GridCellHead(id+":grid:head:email_type",{
							"columns":[
								new EnumGridColumn_email_types("email_type",{"field":model.getField("email_type")})
							],
							"sortable":true
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
extend(MailForSendingList_View,ViewAjx);

/* Constants */


/* private members */

/* protected*/


/* public methods */

