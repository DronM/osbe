/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2012
 
 * @class
 * @classdesc Visual Edit string control
 
 * @extends EditString
 
 * @requires controls/EditString.js

 * @param {string} id
 * @param {Object} options
 * @param {boolean} [options.cmdClear=false]
 * @param {int} [options.rows=DEF_ROWS]

 */
function EditText(id,options){
	options = options || {};
	
	options.cmdClear = (options.cmdClear!=undefined)? options.cmdClear:false;
	
	EditText.superclass.constructor.call(this,id,options);
	
	this.setRows(options.rows || this.DEF_ROWS);
}
extend(EditText,EditString);

/* constants */
EditText.prototype.DEF_TAG_NAME = "TEXTAREA";
EditText.prototype.DEF_ROWS = "5";

EditText.prototype.setRows = function(rows){
	if (rows) this.setAttr("rows",rows);
}
EditText.prototype.getRows = function(){
	return this.getAttr("rows");
}
