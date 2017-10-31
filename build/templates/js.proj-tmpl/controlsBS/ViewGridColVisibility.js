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
function ViewGridColVisibility(id,options){
	options = options || {};	

	options.colCheckCaption = "Видимость";
	options.colCheckId = "_col_visib";
	options.paramId = "visibility";

	ViewGridColVisibility.superclass.constructor.call(this,id,options);
}
extend(ViewGridColVisibility,ViewGridColParam);

/* Constants */


/* private members */

/* protected*/
ViewGridColVisibility.prototype.addCells = function(row,fieldStruc){
	//отображать
	row.addElement(new GridCell(this.getId()+"_"+fieldStruc.id+this.m_colCheckId,
		{"controlContainer":new EditCheckBox(this.getId()+"_fld_"+fieldStruc.id,{			
			"className":"field_toggle",
			"checked":fieldStruc.checked,
			"attrs":{"align":"center"}
			})
		}
	));
	
	//наименование
	row.addElement(new GridCell(this.getId()+"_"+fieldStruc.id+"_col_name",
		{"value":fieldStruc.descr}
	));

}

ViewGridColVisibility.prototype.addHeadCells = function(row){
	row.addElement(new GridDbHeadCell(this.getId()+"_col"+this.m_colCheckId,{"value":this.m_colCheckCaption}));
	row.addElement(new GridDbHeadCell(this.getId()+"_col_columns",{"value":"Колонки"}));
}

ViewGridColVisibility.prototype.saveRow = function(ar,row,id){
	ar.push({
		"id":id,
		"descr":row.m_elements[this.getId()+"_"+id+"_col_name"].getValue(),
		"checked":row.m_elements[this.getId()+"_"+id+this.m_colCheckId].m_controlContainer.getChecked()
	});

}

/* public methods */
