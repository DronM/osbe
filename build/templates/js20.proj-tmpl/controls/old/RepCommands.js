/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>,2012

 * @class
 * @classdesc
  
 * @requires controls/ControlContainer.js
 * @requires controls/ButtonCmd.js 

 * @param {string} id Object identifier
 * @param {namespace} options
 
 * @param {Control} [options.controlMake=ButtonCmd]
 * @param {Control} [options.controlPrint=ButtonCmd]
 * @param {Control} [options.controlFilter=ButtonCmd]
 * @param {Control} [options.controlExcel=ButtonCmd]
 * @param {Control} [options.controlPdf=ButtonCmd]
 
 * @param {bool} [options.cmdMake=true]
 * @param {bool} [options.cmdPrint=true]
 * @param {bool} [options.cmdFilter=true]
 * @param {bool} [options.cmdExcel=true]
 * @param {bool} [options.cmdPdf=true]
 
 * @param {function} onReport
 * @param {function} onExcel
 * @param {function} onPrint
 * @param {function} onPdf

 * @param {bool} [expanded=false]
 * @param {} filters 
*/

function RepCommands(id,options){
	options = options || {};
	
	RepCommands.superclass.constructor.call(this,id,(options.tagName || this.DEF_TAG_NAME),options);

	options.cmdMake = (options.cmdMake!=undefined)? options.cmdMake:true;
	options.cmdPrint = (options.cmdPrint!=undefined)? options.cmdPrint:true;
	options.cmdFilter = (options.cmdFilter!=undefined)? options.cmdFilter:true;
	options.cmdFilterSave = (options.cmdFilterSave!=undefined)? options.cmdFilterSave:(options.variantStorage!=undefined);
	options.cmdFilterOpen = (options.cmdFilterOpen!=undefined)? options.cmdFilterOpen:(options.variantStorage!=undefined);	
	options.cmdExcel = (options.cmdExcel!=undefined)? options.cmdExcel:false;
	options.cmdPdf = (options.cmdPdf!=undefined)? options.cmdPdf:false;
	
	options.expanded = (options.expanded==undefined)? options.expanded:true;
	
	options.variantStorage = options.variantStorage || {};
	
	var self = this;
	
	/* make */
	if (options.cmdMake){
		this.setControlMake(options.controlMake || new ButtonCmd(id+":cmdMake",
			{"caption":this.BTN_MAKE_CAP,
			"onClick":function(){
				options.onReport();
			},
			"attrs":{"title":this.BTN_MAKE_TITLE}
			})
		);
	
	}
	
	/* Print */
	if (options.cmdPrint){
		this.setControlPrint(options.controlPrint || new ButtonCmd(id+":cmdPrint",
			{"caption":this.BTN_PRINT_CAP,
			"onClick":function(e){
				options.onPrint();
			},
			"attrs":{"title":this.BTN_PRINT_TITLE}
			})
		);		
	}

	/* Excel */
	if (options.cmdExcel){
		this.setControlExcel(options.controlExcel || new ButtonCmd(id+":cmdExcel",
			{"caption":this.BTN_EXCEL_CAP,
			"onClick":function(e){
				options.onExcel();
			},
			"attrs":{"title":this.BTN_EXCEL_TITLE}
			})
		);		
	}

	/* PDF */
	if (options.cmdExcel){
		this.setControlExcel(options.controlExcel || new ButtonCmd(id+":cmdPDF",
			{"caption":this.BTN_PDF_CAP,
			"onClick":function(e){
				options.onPDF();
			},
			"attrs":{"title":this.BTN_PDF_TITLE}
			})
		);		
	}
	
	if (options.cmdFilter){
		if (options.cmdFilterSave){		
			this.setCmdFilterSave( (typeof(options.cmdFilterSave)=="object")?
				options.cmdFilterSave : new GridCmdFilterSave(id+":filterSave",{
					"variantStorageName":options.variantStorage.name,
					"dataCol":"filter_data",
					"app":options.app
				})
			);
		}		
		
		if (options.cmdFilterOpen){		
			this.setCmdFilterOpen( (typeof(options.cmdFilterOpen)=="object")?
				options.cmdFilterOpen : new GridCmdFilterOpen(id+":filterOpen",{
					"variantStorageName":options.variantStorage.name,
					"dataCol":"filter_data",
					"app":options.app
				})
			);
		}
				
		this.setCmdFilter( (typeof(options.cmdFilter)=="object")?
			options.cmdFilter : new GridCmdFilter(id+":filter",{
				"filters":options.filters,
				"controlSave":this.getCmdFilterSave(),
				"controlOpen":this.getCmdFilterOpen(),
				"variantStorageModel":options.variantStorage.model,
				"app":options.app
			})
		);				
	
		/*
		this.setControlFilter(options.controlFilter || new GridFilter(CommonHelper.uniqid(),{
			"cmdSet":false,
			"cmdUnset":false,
			"className":("form-horizontal collapse"+(options.expanded)? " in":""),
			"filters":options.filters,
			"app":options.app
			})
		);
	
		this.setControlFilterToggle(options.controlFilterToggle || new ButtonCmd(id+":cmdToggle",{
			"attrs":{
				//"data-toggle":"collapse",
				//"data-target":("#"+this.m_controlFilter.getId()),
				"title":this.BTN_FILTER_TITLE
			},
			"onClick":function(){
				var filter = self.getControlFilter();				
				$(filter.getNode()).collapse("toggle");
				if (!DOMHelper.hasClass(filter.getNode(),"in")){
					var filters = filter.getFilter().getFilters();
					for (var id in filters){
						filters[id].binding.getControl().focus();
						break;
					}
				}
			},
			"caption":this.BTN_FILTER_CAP,
			"glyph":"glyphicon-triangle-bottom",
			"app":options.app
			})
		);
		*/	
	}
	
	this.addControls();
	
}
extend(RepCommands,ControlContainer);

/* Constants */
RepCommands.prototype.DEF_TAG_NAME = "div";
RepCommands.prototype.DEF_CLASS_NAME = "rep_commands";

/* Private */
RepCommands.prototype.m_controlMake;
RepCommands.prototype.m_controlPrint;
RepCommands.prototype.m_controlExcel;
RepCommands.prototype.m_controlPdf;
RepCommands.prototype.m_controlFilterToggle;
RepCommands.prototype.m_controlFilter;


/* override in extendet classes*/
RepCommands.prototype.addControls = function(){
	if (this.m_controlMake) this.addElement(this.m_controlMake);	
	if (this.m_controlPrint) this.addElement(this.m_controlPrint);
	if (this.m_controlExcel) this.addElement(this.m_controlExcel);
	if (this.m_controlPdf) this.addElement(this.m_controlPdf);
	if (this.m_controlFilter){
		this.addElement(this.m_controlFilterToggle);
		this.addElement(this.m_controlFilter);
	}
	
}


/* Public */
/*
RepCommands.prototype.setEnabled = function(en){
	if(this.m_controlMake) this.m_controlMake.setEnabled(en);	
	if(this.m_controlPrint) this.m_controlPrint.setEnabled(en);
	if(this.m_controlExcel) this.m_controlExcel.setEnabled(en);
	if(this.m_controlPdf) this.m_controlPdf.setEnabled(en);
	if(this.m_controlFilter) this.m_controlFilter.setEnabled(en);
	
	RepCommands.superclass.setEnabled.call(this,en);
}
*/
RepCommands.prototype.getControlMake = function(){
	return this.m_controlMake;
}
RepCommands.prototype.setControlMake = function(v){
	this.m_controlMake = v;
}

RepCommands.prototype.getControlExcel = function(){
	return this.m_controlEdit;
}
RepCommands.prototype.setControlExcel = function(v){
	this.m_controlExcel = v;
}

RepCommands.prototype.getControlPdf = function(){
	return this.m_controllPdf;
}
RepCommands.prototype.setControlPdf = function(v){
	this.m_controlPdf = v;
}

RepCommands.prototype.getControlPrint = function(){
	return this.m_controlPrint;
}
RepCommands.prototype.setControlPrint = function(v){
	this.m_controlPrint = v;
}

/*
RepCommands.prototype.getControlFilter = function(){
	return this.m_controlFilter;
}
RepCommands.prototype.setControlFilter = function(v){
	this.m_controlFilter = v;
}
RepCommands.prototype.getControlFilterToggle = function(){
	return this.m_controlFilterToggle;
}
RepCommands.prototype.setControlFilterToggle = function(v){
	this.m_controlFilterToggle = v;
}
*/
//**************************************
RepCommands.prototype.getCmdFilter = function(){
	return this.m_cmdFilter;
}
RepCommands.prototype.setCmdFilter = function(v){
	this.m_cmdFilter = v;
}

RepCommands.prototype.getCmdFilterSave = function(){
	return this.m_cmdFilterSave;
}
RepCommands.prototype.setCmdFilterSave = function(v){
	this.m_cmdFilterSave = v;
}

RepCommands.prototype.getCmdFilterOpen = function(){
	return this.m_cmdFilterOpen;
}
RepCommands.prototype.setCmdFilterOpen = function(v){
	this.m_cmdFilterOpen = v;
}

