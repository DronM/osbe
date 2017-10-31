/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2012
 
 * @class
 * @classdesc 
 
 * @requires core/extend.js
 * @requires core/ControlContainer.js
 * @requires core/CommonHelper.js    
  
 * @param {string} id
 * @param {namespace} options
 * @param {string} options.tagName
 * @param {string} options.optionClass
 * @param {array} options.elements - Array of object{string||bool value, string descr, bool checked}
 * @param {bool} [options.addNotSelected=true]
 * @param {bool} [options.notSelectedLast=false]
 * @param {Array} options.options
 */
function EditContainer(id,options){
	options = options || {};
		
	if (!options.optionClass){
		throw Error(this.ER_NO_OPT_CLASS);
	}

	if (!options.tagName){
		throw Error(this.ER_NO_TAG);
	}
	
	/* if node exists it will be a container!!!*/
	var n = CommonHelper.nd(id,this.getWinObjDocument());
	if (n){
		n.id = n.id + ":cont";
	}		
	
	options.className = options.className || this.DEF_CLASS;
	
	options.elements = options.elements || [];
	
	this.setAddNotSelected((options.addNotSelected!=undefined)? options.addNotSelected:true);
	this.setNotSelectedLast((options.notSelectedLast!=undefined)? options.notSelectedLast:false);
	this.setOptionClass(options.optionClass);
	
	this.setOnSelect(options.onSelect);
	
	this.m_initValue = options.value;	
	options.value = undefined;
		
	var opt_selected = false;
	if (this.m_addNotSelected){
		var def_opt_opts = {"value":this.NOT_SELECTED_VAL,"descr":this.NOT_SELECTED_DESCR};
	}
	
	if (options.options){
		for (var i=0;i<options.options.length;i++){
			if (options.options[i]!=undefined && options.options[i].checked==true){
				opt_selected = true;
				break;
			}
		}	
	}
	
	var opt_ind = 0;
	
	if (this.m_addNotSelected && !this.m_notSelectedLast){
		if (!opt_selected){
			opt_selected.checked = true;
		}
		options.elements.push(new options.optionClass(id+":"+opt_ind,def_opt_opts));	
		opt_ind++;
	}

	if (options.options){		
		for (var i=0;i<options.options.length;i++){
			options.elements.push(new options.optionClass(id+":"+opt_ind,options.options[i]))	
			opt_ind++;
		}	
	}
	
	if (this.m_addNotSelected && this.m_notSelectedLast){
		if (!opt_selected){
			opt_selected.checked = true;
		}
		options.elements.push(new options.optionClass(id+":"+opt_ind,def_opt_opts));	
	}
	
	//CONSTRUCTOR	
	EditContainer.superclass.constructor.call(this, id, options.tagName, options);
		
	if (options.label){
		this.setLabel(options.label);
	}
	else if (options.labelCaption){
		this.setLabel(new Label(id+":label",
			{"value":options.labelCaption,
			"className":options.labelClassName,
			"visible":this.getVisible()
			}
		));
	}
	this.m_buttons = new ControlContainer(id+":btn-cont",
		"div",{"className":this.BTNS_CONTAINER_CLASS,
			"visible":this.getVisible(),
			"enabled":this.getEnabled(),
			"readOnly":this.getVisible()
			}
		);
	
	if (options.buttonOpen){
		this.m_buttons.addElement(options.buttonOpen);
	}
	if (options.buttonSelect){
		this.m_buttons.addElement(options.buttonSelect);
	}
	if (options.buttonClear){
		this.m_buttons.addElement(options.buttonClear);
	}
	
	this.m_contClassName = options.contClassName||this.DEF_CONT_CLASS;
	
	this.m_editContClassName = options.editContClassName || (this.DEF_EDIT_CONT_CLASS +" "+ window.getBsCol("8"));
	
	this.setErrorControl(options.errorControl || new ErrorControl(id+":error") );
}
extend(EditContainer,ControlContainer);

EditContainer.prototype.m_label;
EditContainer.prototype.m_buttons;
EditContainer.prototype.m_errorControl;
EditContainer.prototype.m_editContainer;
EditContainer.prototype.m_container;

EditContainer.prototype.m_addNotSelected;
EditContainer.prototype.m_notSelectedLast;
EditContainer.prototype.m_optionClass;
EditContainer.prototype.m_formatFunction;

EditContainer.prototype.m_initValue;

EditContainer.prototype.getErrorControl = function(){
	return this.m_errorControl;
}
EditContainer.prototype.setErrorControl = function(v){
	this.m_errorControl = v;
}


/* constants */
EditContainer.prototype.DEF_CLASS = "form-control";
EditContainer.prototype.DEF_CONT_CLASS = "form-group";
EditContainer.prototype.BTNS_CONTAINER_CLASS="input-group-btn";
EditContainer.prototype.INCORRECT_VAL_CLASS="error";
EditContainer.prototype.DEF_EDIT_CONT_CLASS = "input-group";
EditContainer.prototype.VAL_INIT_ATTR = "initValue";
EditContainer.prototype.NOT_SELECTED_VAL = "null";

EditContainer.prototype.addOption = function(opt){
	this.addElement(opt);
}

EditContainer.prototype.getIndex = function(){
	if (this.m_node.options && this.m_node.options.length){
		return this.m_node.selectedIndex;
	}
}

EditContainer.prototype.setIndex = function(ind){
	if (this.m_node.options && this.m_node.options.length>ind){
		this.m_node.selectedIndex = ind;
	}
}

EditContainer.prototype.getOption = function(){
	var i = this.getIndex();
	if (i>=0){
		return this.getElementByIndex(i);
	}
}

EditContainer.prototype.setValue = function(val){
	this.setAttr("value",val);	
}

EditContainer.prototype.getValue = function(){
	var v = EditContainer.superclass.getValue.call(this);
	if (v==this.NOT_SELECTED_VAL){
		v = null;
	}
	return v;
}

EditContainer.prototype.setInitValue = function(val){
	this.setAttr(this.VAL_INIT_ATTR,val);
	this.setValue(val);
}

EditContainer.prototype.getInitValue = function(){
	var v = this.getAttr(this.VAL_INIT_ATTR);
	if (v==this.NOT_SELECTED_VAL){
		v = null;
	}
	return v;	
}

EditContainer.prototype.setLabel = function(label){
	this.m_label = label;
}

EditContainer.prototype.getLabel = function(){
	return this.m_label;
}

EditContainer.prototype.setValidator = function(v){
	this.m_validator = v;
}
EditContainer.prototype.getValidator = function(){
	return this.m_validator;

}

EditContainer.prototype.getButtons = function(){
	return this.m_buttons;
}

EditContainer.prototype.setNotValid = function(erStr){
	DOMHelper.addClass(this.m_node,this.INCORRECT_VAL_CLASS);
	this.getErrorControl().setValue(erStr);
}
EditContainer.prototype.setValid = function(){
	DOMHelper.delClass(this.m_node,this.INCORRECT_VAL_CLASS);
	if(this.getErrorControl())this.getErrorControl().clear();
}

EditContainer.prototype.toDOM = function(parent){	
	this.m_container = new ControlContainer(this.getId()+":cont","div",{
		"className":this.m_contClassName,
		"visible":this.getVisible()
		});	
	
	if (this.m_label){
		this.m_container.addElement(this.m_label);
	}

	this.m_editContainer = new Control(this.getId()+":edit-cont","div",{
			"className":this.m_editContClassName
			});	
	this.m_container.addElement(this.m_editContainer);
	this.m_container.toDOM(parent);
	
	EditContainer.superclass.toDOM.call(this,this.m_editContainer.getNode());
	
	//error
	this.m_errorControl = new ErrorControl(this.getId()+":error");
	this.m_errorControl.toDOM(this.m_editContainer.getNode());
	
	if (this.m_buttons && !this.m_buttons.isEmpty()){
		this.m_buttons.toDOMAfter(this.getNode());
	}
}
EditContainer.prototype.delDOM = function(){
	EditContainer.superclass.delDOM.call(this);
	
	if (this.m_buttons){
		this.m_buttons.delDOM();
	}
	if (this.m_errorControl){
		this.m_errorControl.delDOM();
	}
	
	if (this.m_editContainer){
		this.m_editContainer.delDOM();
	}
	
	if (this.m_container){
		this.m_container.delDOM();
	}
}

EditContainer.prototype.setVisible = function(visible){
	if (this.m_label){
		this.m_label.setVisible(visible);
		if (this.m_container){
			this.m_container.setVisible(visible);
		}
		if (this.m_edit_container){
			this.m_edit_container.setVisible(visible);
		}
	}
	if (this.m_buttons){
		this.m_buttons.setVisible(visible);
	}
	EditContainer.superclass.setVisible.call(this,visible);
}

EditContainer.prototype.setEnabled = function(enabled){
	if (this.m_buttons){
		this.m_buttons.setEnabled(enabled);
	}
	EditContainer.superclass.setEnabled.call(this,enabled);
}

EditContainer.prototype.reset = function(){
	this.setIndex(0);
}

EditContainer.prototype.isNull = function(){
	var v = this.getValue();
	return (!v || v==this.NOT_SELECTED_VAL);
}

EditContainer.prototype.getModified = function(){
	return (this.getValue() != this.getInitValue());
}

EditContainer.prototype.clear = function(){
	for (var id in this.m_elements){
		DOMHelper.delNode(this.m_elements[id].m_node);
	}
	this.m_elements = {};
}

EditContainer.prototype.getAddNotSelected = function(){
	return this.m_addNotSelected;
}
EditContainer.prototype.setAddNotSelected = function(v){
	this.m_addNotSelected = v;
}

EditContainer.prototype.getNotSelectedLast = function(){
	return this.m_notSelectedLast;
}
EditContainer.prototype.setNotSelectedLast = function(v){
	this.m_notSelectedLast = v;
}

EditContainer.prototype.getOptionClass = function(){
	return this.m_optionClass;
}
EditContainer.prototype.setOptionClass = function(v){
	this.m_optionClass = v;
}

EditContainer.prototype.getIsRef = function(){
	return false;
}

EditContainer.prototype.getFormatFunction = function(){
	return this.m_formatFunction;
}
EditContainer.prototype.setFormatFunction = function(v){
	this.m_formatFunction = v;
}
EditContainer.prototype.getContTagName = function(){
	return this.m_formatFunction;
}
EditContainer.prototype.setContTagName = function(v){
	this.m_contTagName = v;
}
EditContainer.prototype.getContClassName = function(){
	return this.m_contClassName;
}
EditContainer.prototype.setContClassName = function(v){
	this.m_contClassName = v;
}
EditContainer.prototype.getEditContClassName = function(){
	return this.m_editContClassName;
}
EditContainer.prototype.setEditContClassName = function(v){
	this.m_editContClassName = v;
}

EditContainer.prototype.getOnSelect = function(){
	return this.m_onSelect;
}
EditContainer.prototype.setOnSelect = function(v){
	this.m_onSelect = v;
}
EditContainer.prototype.getInputEnabled = function(){
	return this.getEnabled();
}
EditContainer.prototype.setInputEnabled = function(v){
	this.setEnabled(v);
}

/*
stub
*/
EditContainer.prototype.valueChanged = function(){
}

