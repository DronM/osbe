/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc
	
 * @param {string} id view identifier
 * @param {namespace} options
 */	
function ViewSectionSelect(id,options){
	options = options || {};
	options.model = new ViewSectionList_Model();
	options.required = true;
	if (options.labelCaption!=""){
		options.labelCaption = options.labelCaption || this.LABEL_CAPTION;
	}
	
	options.keyIds = options.keyIds || ["section"];
	options.modelKeyFields = [options.model.getField("section")];
	options.modelDescrFields = [options.model.getField("section")];
	
	var contr = new View_Controller();
	options.readPublicMethod = contr.getPublicMethod("get_section_list");
	
	ViewSectionSelect.superclass.constructor.call(this,id,options);
	
}
extend(ViewSectionSelect,EditSelectRef);

