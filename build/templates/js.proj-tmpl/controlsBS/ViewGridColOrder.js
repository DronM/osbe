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
function ViewGridColOrder(id,options){
	options = options || {};	
	
	options.colCheckCaption = "Сортировка";
	options.colCheckId = "_col_order";
	options.paramId = "order";

	ViewGridColOrder.superclass.constructor.call(this,id,options);
}
extend(ViewGridColOrder,ViewGridColParam);

/* Constants */


/* private members */

/* protected*/
ViewGridColOrder.prototype.addHeadCells = function(row){
	row.addElement(new GridDbHeadCell(this.getId()+"_col"+this.m_colCheckId,{"value":this.m_colCheckCaption}));
	row.addElement(new GridDbHeadCell(this.getId()+"_col_directs",{"value":"Направление возр./убыв."}));
	row.addElement(new GridDbHeadCell(this.getId()+"_col_columns",{"value":"Колонка"}));
}

ViewGridColOrder.prototype.addCells = function(row,fieldStruc){
	debugger;
	//отображать
	row.addElement(new GridCell(this.getId()+"_"+fieldStruc.id+this.m_colCheckId,
		{"controlContainer":new EditCheckBox(this.getId()+"_fld_"+fieldStruc.id,{			
			"className":"field_toggle",
			"checked":fieldStruc.checked,
			"attrs":{"align":"center"}
			})
		}
	));
	
	//направление
	
	var at_asc = {};
	var at_desc = {};
	if (fieldStruc.checked && fieldStruc.direct=="asc"){
		at_asc.checked="checked";
	}
	if (fieldStruc.checked && fieldStruc.direct=="desc"){
		at_desc.checked="checked";
	}
	
	var cont = new EditRadioGroup(this.getId()+"radiogroup",{
		"elements":[
			new EditRadio(this.getId()+"-radio-asc",{
				"value":"asc",
				"name":fieldStruc.id+"_direct",
				"editContClassName":"input-group "+get_bs_col()+"1",
				"attrs":at_asc}),
			new EditRadio(this.getId()+"-radio-desc",{
				"value":"desc",
				"name":fieldStruc.id+"_direct",
				"editContClassName":"input-group "+get_bs_col()+"1",
				"attrs":at_desc})
		]
	});
	row.addElement(new GridCell(this.getId()+"_"+fieldStruc.id+this.m_colCheckId+"_direct",
		{"controlContainer":cont}
	));
	
	//наименование
	row.addElement(new GridCell(this.getId()+"_"+fieldStruc.id+"_col_name",
		{"value":fieldStruc.descr}
	));

}

ViewGridColOrder.prototype.saveRow = function(ar,row,id){
	var checked = row.m_elements[this.getId()+"_"+id+this.m_colCheckId].m_controlContainer.getChecked();
	var direct = "undefined";
	if (checked){
		direct = row.m_elements[this.getId()+"_"+id+this.m_colCheckId+"_direct"].m_controlContainer.getValue();
	}
	ar.push({
		"id":id,
		"descr":row.m_elements[this.getId()+"_"+id+"_col_name"].getValue(),
		"checked":checked,
		"direct":direct
	});

}

/* public methods */
