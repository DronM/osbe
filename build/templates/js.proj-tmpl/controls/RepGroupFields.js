/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires common/functions.js
*/

/* constructor */
function RepGroupFields(id,options){
	options = options ||{};

	//Заголовок
	options.head = new GridHead();
	var row = new GridRow(id+"_head_row");	
	var self = this;
	row.addElement(new GridDbHeadCell(id+"_col_groups",{
		"controlContainer":new EditCheckBox(id+"_col_groups_toggle",{
			"labelCaption":"Группировки",
			"className":"group_toggle",
			"labelAlign":"left",
			"events":{
				"onChange":function(elem){						
						self.onSetAll("group_toggle",elem.checked);
					}
				}
			})		
		}));
	row.addElement(new GridDbHeadCell(id+"_col_filter",{
		"controlContainer":new EditCheckBox(id+"_col_filtered_toggle",{
			"labelCaption":"Фильтр",
			"className":"filtered_toggle",
			"labelAlign":"left",
			"events":{
				"onChange":function(elem){						
						self.onSetAll("filtered_toggle",elem.checked);
					}
				}
			})	
		}));
	row.addElement(new GridDbHeadCell(id+"_col_filter_vals",{
		"value":"Значения фильтра"}));
		
	options.head.addElement(row);
	options.body = new GridBody();
	
	RepGroupFields.superclass.constructor.call(this,
		id,options);
}
extend(RepGroupFields,RepBaseFields);

/*
	id
	name
	filtered
	filterControl
*/
RepGroupFields.prototype.addField = function(fieldStruc){
	var row = new GridRow(this.getId()+"_row_"+fieldStruc.id,{
		"attrs":{"fieldId":fieldStruc.id}});
	
	row.addElement(new GridCell(this.getId()+"_"+fieldStruc.id+"_name",
		{"controlContainer":new EditCheckBox(this.getId()+"_grp_"+fieldStruc.id,{
			"labelCaption":fieldStruc.name,
			"className":"group_toggle",
			"tableLayout":false,
			"labelAlign":"left"})
		}
	));
	row.addElement(new GridCell(this.getId()+"_"+fieldStruc.id+"_filtered",
		{"controlContainer":new EditCheckBox(this.getId()+"_filtered_"+fieldStruc.id),
		"className":"filtered_toggle",
		"tableLayout":false,
		"attrs":{"align":"center"}
		}
	));
	row.addElement(new GridCell(this.getId()+"_"+fieldStruc.id+"_filterVal",
		{"controlContainer":fieldStruc.filterControl}
	));
	
	this.m_body.addElement(row);
}
RepGroupFields.prototype.getParams = function(filterStruc){
	var b = this.getBody();
	var rows = b.m_node.getElementsByTagName("tr");
	for (var i=0;i<rows.length;i++){
		var r_id = rows[i].id;
		var id = b.m_elements[r_id].getAttr("fieldId");
		if (b.m_elements[r_id].m_elements[this.getId()+"_"+id+"_name"].m_controlContainer.getChecked()){
			//group
			filterStruc.grp_fields=(filterStruc.grp_fields==null)? "":filterStruc.grp_fields;
			filterStruc.grp_fields+=((filterStruc.grp_fields)? ",":"")+id;
		}
		if (b.m_elements[r_id].m_elements[this.getId()+"_"+id+"_filtered"].m_controlContainer.getChecked()){
			//filtered
			var ctrl = b.m_elements[r_id].m_elements[this.getId()+"_"+id+"_filterVal"].m_controlContainer;
			var f_val = ctrl.getValue();
			if (f_val!="undefined"){
				if (ctrl.m_keyFieldIds){
					id = ctrl.m_keyFieldIds[0];
					f_val = ctrl.getFieldValue(id);
					console.log("id="+id+" val="+f_val);
				}
				filterStruc.fields=(filterStruc.fields==null)? "":filterStruc.fields;
				filterStruc.fields+=((filterStruc.fields)? ",":"")+id;
				
				filterStruc.signs=(filterStruc.signs==null)? "":filterStruc.signs;
				filterStruc.signs+=((filterStruc.signs)? ",":"")+"e";
				
				filterStruc.vals=(filterStruc.vals==null)? "":filterStruc.vals;
				filterStruc.vals+=((filterStruc.vals)? ",":"")+f_val;
			};
		}		
	}	
}