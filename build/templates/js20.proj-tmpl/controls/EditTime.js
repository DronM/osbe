/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2012
 
 * @class
 * @classdesc Basic visual control, maps html tag 
 
 * @requires core/extend.js
 * @requires core/Edit.js
 * @requires core/CommonHelper.js    
  
 * @param {string} id
 * @param {namespace} options
 * @param {string} options.editMask
 * @param {string} options.dateFormat - example d/m/Y H:s:i
 */ 
function EditTime(id,options){
	options = options || {};
	options.validator = options.validator || new ValidatorTime(options);
	
	//@ToDo different UI
	options.cmdSelect = (options.cmdSelect!=undefined)? options.cmdSelect:false;
	
	options.editMask = options.editMask || this.DEF_MASK;//window.getApp().getTimeEditMask();
	options.dateFormat = options.dateFormat || window.getApp().getTimeFormat();
	
	EditTime.superclass.constructor.call(this,id,options);
}
extend(EditTime,EditDateTime);

/* constants */
EditTime.prototype.DEF_MASK = "99:99";
EditTime.prototype.PART_SEP = ":";
EditTime.prototype.MSEC_PART_SEP = ".";

EditTime.prototype.toISODate = function(str){
	if (str=="") return "";
	
	var t = str.substr(0,2);
	if (str.length>2){
		t+=this.PART_SEP+str.substr(2,2);
	}
	if (str.length>4){
		t+=this.PART_SEP+str.substr(4,2);
	}
	if (str.length>6){
		t+=this.MSEC_PART_SEP+str.substr(6);
	}
	return t;
}


/* public methods */
