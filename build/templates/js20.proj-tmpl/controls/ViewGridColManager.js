/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>,2016

 * @class
 * @classdesc Grid column manager view

 * @requires core/extend.js  
 * @requires controls/ControlContainer.js

 * @param {string} id Object identifier
 * @param {namespace} options
 * @param {string} options.variantStorageName
 * @param {Grid} options.grid
 * @param {ModelFilter} options.filter 
*/
function ViewGridColManager(id,options){

	options = options || {};	
	
	var self = this;
	
	this.m_onClose = options.onClose;
	this.m_filter = options.filter;
	this.m_onApplyFilters = options.onApplyFilters;
	this.m_onResetFilters = options.onResetFilters;
		
	ViewGridColManager.superclass.constructor.call(this,id,"template",options);
	
	this.addElement(
		new ViewGridColVisibility(id+":view-visibility",{
			"colStruc":options.colVisibility,
			"variantStorageName":options.variantStorageName,
			"grid":options.grid
		})
	);
		
	this.addElement(
		new ViewGridColOrder(id+":view-order",{
			"colStruc":options.colOrder,
			"variantStorageName":options.variantStorageName,
			"grid":options.grid
		})
	);
	
	this.addElement(new ButtonCmd(id+":save",
			{"glyph":"glyphicon-save",
			"onClick":function(){
				options.onVariantSave();				
			},
			"attrs":{"title":""},
			"app":window.getApp()
	}));
	
	this.addElement(new ButtonCmd(id+":open",
			{"glyph":"glyphicon-open",
			"onClick":function(){
				options.onVariantSave();
			},
			"attrs":{"title":""},
			"app":window.getApp()
	}));	
	
	/*
	this.addElement(
		new GridCmdFilterView(id+":view-filter",{
			"filter":this.m_filter,
			"onApplyFilters":function(){
				self.m_onResetFilters();
			},
			"onResetFilters":function(){	
				self.m_onResetFilters();					
			},
		
			"grid":options.grid
		})
	);
	*/
}
extend(ViewGridColManager,ControlContainer);//

/* Constants */

/* private members */

/* protected*/


/* public methods */

