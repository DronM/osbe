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
function RepAggFields(id,options){
	options = options ||{};

	//Заголовок
	options.head = new GridHead();
	var row = new GridRow(id+"_head_row");	
	
	row.addElement(new GridDbHeadCell(id+"_col_agg_fields",{
		"value":"Показатели"}));
		
	options.head.addElement(row);
	options.body = new GridBody();
	
	RepAggFields.superclass.constructor.call(this,
		id,options);
		
}
extend(RepAggFields,RepBaseFields);

/*
	id
	name
	types - string
*/
RepAggFields.prototype.addField = function(fieldStruc){
	var row = new GridRow(this.getId()+"_row_"+fieldStruc.id,{
		"attrs":{"fieldId":fieldStruc.id}});

	var type = new EditSelect(this.getId()+"_agg_"+fieldStruc.id,{
			"tableLayout":false});
	type.addElement(new EditSelectOption("undefined",{
		"optionSelected":true,
		"optionDescr":"не рассчитывать",
		"optionId":"undefined"}));
	if (fieldStruc.types.indexOf("sum")>=0){
		type.addElement(new EditSelectOption("sum",{
			"optionDescr":"сумма",
			"optionId":"sum"}));
	}
	if (fieldStruc.types.indexOf("avg")>=0){
		type.addElement(new EditSelectOption("avg",{
			"optionDescr":"среднее",
			"optionId":"avg"}));		
	}
	row.addElement(new GridCell(this.getId()+"_"+fieldStruc.id+"_agg_name",
		{"controlContainer":type,"value":fieldStruc.name}
	));
	
	this.m_body.addElement(row);
}
RepAggFields.prototype.getParams = function(filterStruc){
	var b = this.getBody();
	var rows = b.m_node.getElementsByTagName("tr");
	for (var i=0;i<rows.length;i++){
		var r_id = rows[i].id;
		var id = b.m_elements[r_id].getAttr("fieldId");
		var v = b.m_elements[r_id].m_elements[this.getId()+"_"+id+"_agg_name"].m_controlContainer.getValue();
		if (v!="undefined"){
			filterStruc.agg_fields=(filterStruc.agg_fields==null)? "":filterStruc.agg_fields;
			filterStruc.agg_fields+=((filterStruc.agg_fields)? ",":"")+id;
			filterStruc.agg_types=(filterStruc.agg_types==null)? "":filterStruc.agg_types;
			filterStruc.agg_types+=((filterStruc.agg_types)? ",":"")+v;			
		}
	}	
}