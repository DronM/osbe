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
function ConstantEditInlineAjx(id,options){
	options = options || {};	
	
	this.m_ctrlColumnClasses = options.ctrlColumnClasses;
	
	ConstantEditInlineAjx.superclass.constructor.call(this);
}
extend(ConstantEditInlineAjx,ViewGridEditInlineAjx);

/* Constants */


/* private members */

/* protected*/


/* public methods */
ConstantEditInlineAjx.prototype.addEditControls = function(){
	var view_id = this.getId();	
	
	var columns = this.getGrid().getHead().getColumns();
	
	var column_class;
	var ctrlClass;
	var val_type = this.m_model.getFieldValue("val_type");
	
	if (this.m_ctrlColumnClasses[const_id]){
		if (this.m_ctrlColumnClasses[const_id].ctrlClass){
			ctrlClass = this.m_ctrlColumnClasses[const_id].ctrlClass;
		}
		else{
			ctrlClass = EditString;
		}
		if (this.m_ctrlColumnClasses[const_id].columnClass){
			column_class = this.m_ctrlColumnClasses[const_id].columnClass;
		}
		else{
			column_class = GridColumn;
		}				
		if (this.m_ctrlColumnClasses[const_id].ctrlOptions){
			CommonHelper.merge(ctrlOptions,this.m_ctrlColumnClasses[const_id].ctrlOptions);
		}				
	}
	else{
		if (val_type=="Bool"){
			column_class = GridColumnBool;
			ctrlClass = EditCheckBox;
		}
		else if (val_type=="Date"){
			column_class = GridColumnDate;
			ctrlClass = EditDate;
		}
		else if (val_type=="DateTime"){
			column_class = GridColumnDateTime;
			ctrlClass = EditDateTime;
		}
		else if (val_type=="Interval"){
			column_class = GridColumn;
			ctrlClass = EditTime;
		}				
		else if (val_type=="Float"){
			column_class = GridColumnFloat;					
			ctrlClass = EditFloat;
		}				
		else{
			column_class = GridColumn;
			ctrlClass = EditString;
		}							
	}
	
	this.addElement(new EditString(view_id+":name",{
		"value":columns["name"].getFieldValue(),
		"enabled":false,
		"app":this.getApp()
	}));
	
	this.addElement(new EditString(view_id+":descr",{
		"value":columns["descr"].getFieldValue(),
		"enabled":false,
		"app":this.getApp()
	}));

	var ctrl = new ctrlClass(view_id+":val_descr",{
		"app":this.getApp()
	});
	
	if (ctrl.getIsRef()){
	
	}
	else{
		ctrl.setValue(columns["val_descr"].getFieldValue());
	}
	
	this.addElement(ctrl);
	
}
