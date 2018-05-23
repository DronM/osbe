/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2012
 
 * @class
 * @classdesc object dialog view
 
 * @extends EditString
 
 * @requires core/extend.js
 * @requires controls/EditString.js       
 * @requires core/AppWin.js      
 
 * @param string id 
 * @param {namespace} options
 * @param {Validator} [options.validator=ValidatorDate] 
 * @param {string} [options.editMask=window.getApp().getDateEditMask()]
 * @param {string} [options.dateFormat=window.getApp().getDateFormat()]
 * @param {string} options.timeValueStr
 * @param {bool} [options.cmdSelect=true]
 */
function EditDate(id,options){
	options = options || {};
	
	options.validator = options.validator || new ValidatorDate(options);
	options.editMask = options.editMask || window.getApp().getDateEditMask();
	this.setDateFormat(options.dateFormat || window.getApp().getDateFormat());
	
	options.attrs = options.attrs || {};
	//options.editContClassName = options.editContClassName || "input-group "+window.getApp().getBsCol()+"2";
	
	options.cmdSelect = (options.cmdSelect!=undefined)? options.cmdSelect:true;
	
	this.setTimeValueStr(options.timeValueStr);
	
	if (options.cmdSelect){
		options.buttonSelect = options.buttonSelect ||
			new ButtonCalendar(id+':btn_calend',{
				"dateFormat":this.getDateFormat(),
				"editControl":this,
				"timeValueStr":this.getTimeValueStr()
			});
	}
	EditDate.superclass.constructor.call(this,id,options);
}
extend(EditDate,EditString);

/* constants */

EditDate.prototype.TIME_SEP = "T";
EditDate.prototype.m_timeValueStr;

/* public methods */

EditDate.prototype.setDateFormat = function(v){
	this.m_dateFormat = v;
}

EditDate.prototype.getDateFormat = function(){
	return this.m_dateFormat;
}

/*
0000-00-00TIME_SEP00:00:00.00000
*/
EditDate.prototype.toISODate = function(str){
	if (str=="") return "";
	var t = str.substr(4,4)+"-"+str.substr(2,2)+"-"+str.substr(0,2);
	if (str.length>8){
		t+= this.TIME_SEP+ str.substr(8,2);
	}
	if (str.length>10){
		t+= ":"+str.substr(10,2);
	}
	if (str.length>12){
		t+= ":"+str.substr(12,2);
	}
	
	return t;
}

EditDate.prototype.getValue = function(){
	if (this.m_node && this.m_node.value){
		var v = (this.getEditMask())? $(this.m_node).mask():this.m_node.value;
		//console.log("EditDate.prototype.getValue val="+this.m_node.value+" unmasked="+v)
		
		v = this.toISODate(v);
		
		if (v.length==0){
			return null;
		}		
		else if (this.m_validator){
			return this.m_validator.correctValue(v);
		}
		else{
			return v;
		}
	}
}

EditDate.prototype.formatOutputValue = function(val){
	return DateHelper.format(val,this.getDateFormat());
}
EditDate.prototype.reset = function(){
	this.getNode().value = "";
	this.focus();
}

/*
EditDate.prototype.setValue = function(val){
	if (this.m_validator){
		val = this.m_validator.correctValue(val);
	}
	this.getNode().value = this.formatOutputValue(val);
	console.log("Edit.prototype.setValue val="+this.getNode().value+", "+val)
	this.applyMask();
	
	if (this.m_eventFuncs && this.m_eventFuncs.change){
		this.m_eventFuncs.change();
	}
}
*/
EditDate.prototype.setInitValue = function(val){
	this.setValue(val);
	this.setAttr(this.VAL_INIT_ATTR,this.getValue());
	//console.log("EditDate.prototype.setInitValue to="+this.getValue())
	//console.log("EditDate.prototype.setValue val="+this.getNode().value+", "+val)
}

EditDate.prototype.setTimeValueStr = function(v){
	this.m_timeValueStr = v;
}

EditDate.prototype.getTimeValueStr = function(){
	return this.m_timeValueStr;
}
