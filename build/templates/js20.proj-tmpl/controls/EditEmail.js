/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>,2014
 
 * @class
 * @classdesc Email edit control
 
 * @extends EditString
 
 * @requires controls/EditString.js
 * @requires core/ValidatorEmail.js     
 
 * @param string id 
 * @param {Object} options
 */
function EditEmail(id,options){
	options = options || {};
	
	options.validator = options.validator || new ValidatorEmail(options);
	//options.editMask = options.editMask || this.DEF_MASK;
	
	EditEmail.superclass.constructor.call(this,id,options);
}
extend(EditEmail,EditString);

/* constants */
//EditEmail.prototype.DEF_MASK = "9@9.9";


/* public methods */
