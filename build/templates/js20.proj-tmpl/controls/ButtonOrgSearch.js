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
function ButtonOrgSearch(id,options){
	options = options || {};	
	
	options.glyph = "glyphicon-search";
	this.m_viewContext = options.viewContext;
	this.m_onGetData = options.onGetData;
	
	var self = this;
	
	options.onClick = options.onClick || 
		function(event){
			self.doSearch();	
		};
	
	ButtonOrgSearch.superclass.constructor.call(this,id,options);
}
extend(ButtonOrgSearch,ButtonCtrl);

/* Constants */


/* private members */

/* protected*/


/* public methods */
ButtonOrgSearch.prototype.doSearch = function(){
	var q = this.getEditControl().getValue();
	if (!q || !q.length){
		throw new Error("Не задан параметр поиска!");
	}
	var pm = (new ClientSearch_Controller()).getPublicMethod("search");
	pm.setFieldValue("query",q);
	this.setEnabled(false);
	var self = this;
	pm.run({
		"ok":function(resp){
			if (resp.modelExists("SearchResult_Model")){
				var m = new ModelXML("SearchResult_Model",{
					"fields":["param","val"],
					"data":resp.getModelData("SearchResult_Model")
				});
			
				if (self.m_onGetData){
					self.m_onGetData(m);
				}
				else{
					var attr_coresp = {
						"Наименование":"name",
						"ФИО руководителя":"dir_name",
						"Должность руководителя":"dir_post",
						"ИНН":"inn",
						"КПП":"kpp",
						"ОГРН":"ogrn",
						"ОКПО":"okpo",
						"ОКВЭД":"okved"
						//"Адрес":"legal_address"
					}
					while(m.getNextRow()){
						var param = m.getFieldValue("param");
						if (attr_coresp[param]){
							self.m_viewContext.getElement(attr_coresp[param]).setValue(m.getFieldValue("val"));
						}					
					}
				}
			}
		},
		"all":function(){
			self.setEnabled(true);
		}
	});
}
