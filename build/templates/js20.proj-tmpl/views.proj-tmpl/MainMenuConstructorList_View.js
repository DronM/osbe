/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc
	
 * @param {string} id view identifier
 * @param {namespace} options
 * @param {namespace} options.models All data models
 * @param {namespace} options.variantStorage {name,model}
 */	
function MainMenuConstructorList_View(id,options){	
	options = options || {};
	
	MainMenuConstructorList_View.superclass.constructor.call(this,id,options);
	
	var model = options.models.MainMenuConstructorList_Model;
	var contr = new MainMenuConstructor_Controller();
	
	var constants = {"doc_per_page_count":null,"grid_refresh_interval":null};
	window.getApp().getConstantManager().get(constants);
	
	var popup_menu = new PopUpMenu();
	
	this.addElement(new GridAjx(id+":grid",{
		"model":model,
		"keyIds":["id"],
		"controller":contr,
		"editInline":false,
		"editWinClass":MainMenuConstructor_Form,
		"popUpMenu":popup_menu,
		"commands":new GridCmdContainerAjx(id+":grid:cmd"),
		"head":new GridHead(id+"-grid:head",{
			"elements":[
				new GridRow(id+":grid:head:row0",{
					"elements":[
						new GridCellHead(id+":grid:head:role_descr",{
							"value":this.GRID_ROLE_DESCR_COL_CAP,
							"columns":[								
								new EnumGridColumn_role_types({
									"field":model.getField("role_id")
								})
							],
							"sortable":true
						}),
						new GridCellHead(id+":grid:head:user_descr",{
							"value":this.GRID_USER_DESCR_COL_CAP,
							"columns":[								
								new GridColumn({
									"field":model.getField("user_descr")
								})
							],
							"sortable":true
						})						
					]
				})
			]
		}),
		"pagination":new GridPagination(id+"_page",
			{"countPerPage":constants.doc_per_page_count.getValue()}),		
		"refreshInterval":0,
		"autoRefresh":false,
		"rowSelect":false,
		"focus":true
	}));	
	


}
extend(MainMenuConstructorList_View,ViewAjx);
