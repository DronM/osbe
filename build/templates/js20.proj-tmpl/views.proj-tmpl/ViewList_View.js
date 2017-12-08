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
function ViewList_View(id,options){
	options = options || {};	
	
	ViewList_View.superclass.constructor.call(this,id,options);
	
	var model = options.models.ViewList_Model;
	var contr = new View_Controller();
	
	var constants = {"doc_per_page_count":null};
	window.getApp().getConstantManager().get(constants);
	
	var filters = {
		"section":{
			"binding":new CommandBinding({
				"control":new ViewSectionSelect(id+":filter-section",{
					"labelCaption":undefined,
					"contClassName":"form-group "+window.getBsCol(12)
					}),
				"field":new FieldString("section")}),
			"sign":"e"
		}
	};
	
	var popup_menu = new PopUpMenu();
	
	var grid = new GridAjx(id+":grid",{
		"model":model,
		"keyIds":["id"],
		"controller":contr,
		"editInline":null,
		"editWinClass":null,
		"popUpMenu":popup_menu,
		"commands":new GridCmdContainerAjx(id+":grid:cmd",{
			"filters":filters,
			"cmdInsert":false,
			"cmdCopy":new GridCmd(id+":grid:cmd:openNewWin",{
				"glyph":"glyphicon glyphicon-duplicate",
				"title":this.OPEN_WIN_TITLE,
				"showCmdControl":false,
				"onCommand":function(){
					var fields = this.m_grid.getModelRow();
					if (fields){
						var form = new WindowFormObject({
							"app":window.getApp(),
							"formName":fields.t.getValue(),
							"controller":fields.c.getValue(),
							"method":fields.f.getValue()
						});
						form.open();
					}
				}
			}),
			"cmdDelete":false,
			"cmdEdit":new GridCmd(id+":grid:cmd:open",{
				"glyph":"glyphicon-eye-open",
				"title":this.OPEN_TITLE,
				"showCmdControl":false,
				"onCommand":function(){
					this.m_grid.onEdit();
				}
			})
		}),
		"head":new GridHead(id+"-grid:head",{
			"elements":[
				new GridRow(id+":grid:head:row0",{					
					"elements":[
						new GridCellHead(id+":grid:head:user_descr",{
							"value":this.GRID_COL_CAP,
							"columns":[
								new GridColumn("user_descr",{"field":model.getField("user_descr")})
							]
						})
					]
				})
			]
		}),
		"pagination":new GridPagination(id+"_page",
			{"countPerPage":constants.doc_per_page_count.getValue()}),		
		
		"autoRefresh":false,
		"refreshInterval":0,
		"rowSelect":false,
		"focus":true
	});		
	
	grid.edit = function(){
		var row = this.getModelRow();					
		window.getApp().showMenuItem(null,row.c.getValue(),row.f.getValue(),row.t.getValue());
	}
	
	this.addElement(grid);
}
extend(ViewList_View,ViewAjx);

/* Constants */


/* private members */

/* protected*/


/* public methods */

