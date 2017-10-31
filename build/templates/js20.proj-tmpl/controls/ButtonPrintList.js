/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc object dialog view
 
 * @extends ControlContainer
 
 * @requires core/extend.js
 * @requires controls/ViewAjx.js       
 
 * @param string id 
 * @param {Object} options
 * @param {string} [options.buttonClassName=DEF_BTN_CLASS]
 * @param {Array} options.printList
 */
function ButtonPrintList(id,options){	
	options = options || {};
		
	options.className = options.className || this.DEF_CLASS;
	
	var btn_class = (options.buttonClassName || this.DEF_BTN_CLASS) + " dropdown-toggle";
	this.m_button = new ControlContainer(CommonHelper.uniqid(),"button",{
		"className":btn_class,
		"value":this.DEF_CAPTION,
		"title":this.DEF_TITLE,
		"attrs":{
			"type":"button",
			"data-toggle":"dropdown"
		},
		//"elements":[new Control(CommonHelper.uniqid(),"span",{"className":"caret"})]
		"elements":[new Control(CommonHelper.uniqid(),"i",{"className":"glyphicon "+this.DEF_GLYPH})]
	});
	
	this.m_keyIds = options.keyIds;
	
	var print_ctrls = [];
	this.m_objList = [];
	
	/*
	if (options.printList){
		for (var i=0;i<options.printList.length;i++){
			//print_ctrls.push(this.createListItem(options.printList[i]));
			print_ctrls.push(options.printList[i].getControl());
			this.m_objList.push(options.printList[i]);
		}
	}
	*/
	
	this.m_buttons = new ControlContainer(CommonHelper.uniqid(),"ul",{
		"className":"dropdown-menu"
		//"attrs":{"role":"menu"},
		//"elements":print_ctrls
	});
	
	this.setPrintList(options.printList);
	
	options.elements = [this.m_button,this.m_buttons];
		
	ButtonPrintList.superclass.constructor.call(this,id, (options.tagName || this.DEF_TAG_NAME), options);
			
}
extend(ButtonPrintList,ControlContainer);

/* constants */
ButtonPrintList.prototype.DEF_TAG_NAME = "div";
ButtonPrintList.prototype.DEF_CLASS = "btn dropdown";
ButtonPrintList.prototype.DEF_BTN_CLASS = "btn btn-primary";
ButtonPrintList.prototype.DEF_GLYPH = "glyphicon-triangle-bottom";

/* private members */
ButtonPrintList.prototype.m_buttons;
ButtonPrintList.prototype.m_button;
ButtonPrintList.prototype.m_objList;
ButtonPrintList.prototype.m_keyIds;

/* public methods */

/*
*/
ButtonPrintList.prototype.getObjList = function(){
	return this.m_objList;
}

ButtonPrintList.prototype.addToList = function(obj){
	this.m_buttons.addElement(obj.getControl());
	this.m_objList.push(obj);
}

ButtonPrintList.prototype.setGrid = function(v){
	for (var i=0;i<this.m_objList.length;i++){
		this.m_objList[i].setGrid(v);
		this.m_objList[i].setKeyIds(this.m_keyIds);		
	
	}
}
ButtonPrintList.prototype.getKeyIds = function(v){
	return this.m_keyIds;
}

ButtonPrintList.prototype.setPrintList = function(printList){
	this.m_buttons.clear();
	if (printList && printList.length){
		for (var i=0;i<printList.length;i++){
			this.m_buttons.addElement(printList[i].getControl());
			this.m_objList.push(printList[i]);
		}	
	}
}

/*
ButtonPrintList.prototype.getCaption = function(){
	return this.DEF_CAPTION;
}
ButtonPrintList.prototype.getGlyph = function(){
	return this.DEF_GLYPH;
}
*/
