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
	this.m_precision=options.precision;
	EditFloat.superclass.constructor.call(this,id,options);
}
extend(EditFloat,EditNum);

/* constants */
EditFloat.prototype.DEF_PRECISION=2;

/* public methods */

EditFloat.prototype.toDOM = function(parent){
	EditFloat.superclass.toDOM.call(this,parent);
	if (this.m_precision==2&&this.m_editMask==""){
		InitializeTextbox(this.m_node, InputType.Currency,2,this.m_unsigned);
	}
	else if (this.m_editMask==""){
		InitializeTextbox(this.m_node, InputType.FloatNumber,this.m_precision,this.m_unsigned);
	}
}