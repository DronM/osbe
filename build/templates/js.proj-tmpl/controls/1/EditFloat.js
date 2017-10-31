/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
  * @requires core/ValidatorFloat.js
  * @requires controls/EditNum.js
  * @requires extra/JSLib/Textbox.Restriction.js
*/

/* constructor */
function EditFloat(id,options){
	options = options || {};
	options.validator = options.validator || new ValidatorFloat();
	options.editMask = options.editMask||"";
	this.m_precision=options.precision||this.DEF_PRECISION;
	/*
	if (this.m_precision!=2&&options.editMask==""){
		options.editMask = "$d.";
		for (var i=0;i<this.m_precision;i++){
			options.editMask+="$d";
		}
	}
	*/
	EditFloat.superclass.constructor.call(this,id,options);
}
extend(EditFloat,EditNum);

/* constants */
EditFloat.prototype.DEF_PRECISION=2;

EditFloat.prototype.applyEditMask = function(){
	console.log("EditFloat.prototype.applyEditMask id="+this.getId()+" m_precision="+this.m_precision+" m_editMask="+this.m_editMask);
	if (this.m_precision==2&&this.m_editMask==""){
		InitializeTextbox(this.m_node, InputType.Currency);
	}
	else if (this.m_editMask){
		MaskEdit(this.m_node,this.m_editMask);
		//TipEdit(this.m_node.id,"Тест проверка");
	}
}

/* public methods */
EditFloat.prototype.toDOM = function(parent){
	EditFloat.superclass.toDOM.call(this,parent);
	if (this.m_precision==2&&this.m_editMask==""){
		InitializeTextbox(this.m_node, InputType.Currency);
	}	
}
