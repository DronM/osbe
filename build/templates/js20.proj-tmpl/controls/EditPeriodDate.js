/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc Period Edit cotrol
 
 * @extends ControlContainer
 
 * @requires core/extend.js
 * @requires controls/ControlContainer.js
 * @requires controls/ButtonCmd.js               
 
 * @param string id 
 * @param {namespace} options
 * @param {Control} [options.editClass=EditDate]  
 * @param {bool} [options.cmdDownFast=true]
 * @param {bool} [options.cmdDown=true]
 * @param {bool} [options.cmdUpFast=true]
 * @param {bool} [options.cmdUp=true]
 * @param {bool} [options.cmdPeriodSelect=true]       
 * @param {Control} options.controlDownFast
 * @param {Control} options.controlDown 
 * @param {Control} options.controlUpFast 
 * @param {Control} options.controlUp
 * @param {Control} options.controlPeriodSelect
 * @param {string} options.valueFrom
 * @param {string} options.valueTo 
 */
function EditPeriodDate(id,options){
	options = options || {};	
	
	options.template = window.getApp().getTemplate("EditPeriodDate");
	options.templateOptions = options.templateOptions || {
		"CONTR_DOWN_FAST_TITLE":this.CONTR_DOWN_FAST_TITLE,
		"CONTR_DOWN_TITLE":this.CONTR_DOWN_TITLE,
		"CONTR_UP_FAST_TITLE":this.CONTR_UP_FAST_TITLE,
		"CONTR_UP_TITLE":this.CONTR_UP_TITLE
	};
	
	EditPeriodDate.superclass.constructor.call(this,id,"template",options);
	
	var edit_class = options.editClass || EditDate;
	options.cmdDownFast = (options.cmdDownFast!==undefined)? options.cmdDownFast:true;
	options.cmdDown = (options.cmdDown!==undefined)? options.cmdDown:true;
	options.cmdUpFast = (options.cmdUpFast!==undefined)? options.cmdUpFast:true;
	options.cmdUp = (options.cmdUp!==undefined)? options.cmdUp:true;
	options.cmdPeriodSelect = (options.cmdPeriodSelect!==undefined)? options.cmdPeriodSelect:true;
	
	var self = this;
	
	if (options.cmdDownFast){
		this.setControlDownFast(options.controlDownFast || new Button(id+":downFast",
			{"glyph":"glyphicon-triangle-left",
			"onClick":function(){
				}
			}
		));
	}
	
	if (options.cmdDown){
		this.setControlDown(options.controlDown || new Button(id+":down",
			{"glyph":"glyphicon-menu-left",
			"onClick":function(){
			}
			}
		));
	}
	
	
	if (options.cmdUp){
		this.setControlUp(options.controlUp || new Button(id+":up",
			{"glyph":"glyphicon-menu-right",
			"onClick":function(){
			}
			}
		));
	}
		
	this.setControlFrom(options.controlFrom ||
		new edit_class(id+":from",{			
			"value":options.valueFrom,
			"timeValueStr":(options.valueFrom)? DateHelper.format(options.valueFrom,"H:i:s"):this.DEF_FROM_TIME,
			"contClassName":window.getBsCol(6),
			"editContClassName":"input-group "+window.getBsCol(12)
			}
		)
	);
	
	this.setControlTo(options.controlTo ||
		new edit_class(id+":to",{
			"value":options.valueTo,
			"timeValueStr":(options.valueTo)? DateHelper.format(options.valueTo,"H:i:s"):this.DEF_TO_TIME,
			"contClassName":window.getBsCol(6),
			"editContClassName":"input-group "+window.getBsCol(12)
			}
		)
	);
	
	this.setField(options.field);
	
	if (options.cmdUpFast){
		this.setControlUpFast(options.controlUpFast || new Button(id+":upFast",
			{"glyph":"glyphicon-triangle-right",
			"onClick":function(){
			
			}
			}
		));
	}
	if (options.cmdPeriodSelect){
		this.setControlPeriodSelect(options.controlPeriodSelect || new PeriodSelect(this.getId()+":periodSelect",
			{
			"onValueChange":function(){
				self.setPredefinedPeriod(this.getValue());
			}		
			}
		));
	}
	
	//this.m_cont = new ControlContainer(id+":d-cont","div");
	
	this.addControls();
}
extend(EditPeriodDate,ControlContainer);

/* Constants */
EditPeriodDate.prototype.DEF_FROM_TIME = "00:00:00";
EditPeriodDate.prototype.DEF_TO_TIME = "23:59:59";

/* private members */
EditPeriodDate.prototype.m_controlFrom;
EditPeriodDate.prototype.m_controlTo;
EditPeriodDate.prototype.m_controlUp;
EditPeriodDate.prototype.m_controlUpFast;
EditPeriodDate.prototype.m_controlDown;
EditPeriodDate.prototype.m_controlDownFast;
EditPeriodDate.prototype.m_controlPeriodSelect;
EditPeriodDate.prototype.m_field;

/* protected*/
EditPeriodDate.prototype.addControls = function(){

	if (this.m_controlDownFast)this.addElement(this.m_controlDownFast);
	if (this.m_controlDown)this.addElement(this.m_controlDown);
	
	
	if(this.m_controlPeriodSelect)this.addElement(this.m_controlPeriodSelect);
	
	this.addElement(this.m_controlFrom);
	this.addElement(this.m_controlTo);

	if (this.m_controlUp)this.addElement(this.m_controlUp);
	if (this.m_controlUpFast)this.addElement(this.m_controlUpFast);	
}


/* public methods */
EditPeriodDate.prototype.getControlFrom = function(){
	return this.m_controlFrom;
}

EditPeriodDate.prototype.setControlFrom = function(v){
	this.m_controlFrom = v;
}

EditPeriodDate.prototype.getControlTo = function(){
	return this.m_controlTo;
}

EditPeriodDate.prototype.setControlTo = function(v){
	this.m_controlTo = v;
}

EditPeriodDate.prototype.getControlUp = function(){
	return this.m_controlUp;
}

EditPeriodDate.prototype.setControlUp = function(v){
	this.m_controlUp = v;
}

EditPeriodDate.prototype.getControlUpFast = function(){
	return this.m_controlUpFast;
}

EditPeriodDate.prototype.setControlUpFast = function(v){
	this.m_controlUpFast = v;
}

EditPeriodDate.prototype.getControlDownFast = function(){
	return this.m_controlDownFast;
}

EditPeriodDate.prototype.setControlDownFast = function(v){
	this.m_controlDownFast = v;
}

EditPeriodDate.prototype.getControlDown = function(){
	return this.m_controlDown;
}

EditPeriodDate.prototype.setControlDown = function(v){
	this.m_controlDown = v;
}

EditPeriodDate.prototype.getControlPeriodSelect = function(){
	return this.m_controlPeriodSelect;
}

EditPeriodDate.prototype.setControlPeriodSelect = function(v){
	this.m_controlPeriodSelect = v;
}

EditPeriodDate.prototype.getField = function(){
	return this.m_field;
}

EditPeriodDate.prototype.setField = function(v){
	this.m_field = v;
}

EditPeriodDate.prototype.reset = function(){
	this.m_controlFrom.reset();
	this.m_controlTo.reset();
}

EditPeriodDate.prototype.focus = function(){
	this.getControlFrom().focus();
}

/**
 * @returns [Array]
 */
EditPeriodDate.prototype.getValue = function(){
	/*
	var ctrl_from = this.getControlFrom();
	var ctrl_to = this.getControlTo();
	var res;
	if (
		(ctrl_from && !ctrl_from.isNull())
		|| (ctrl_to && !ctrl_to.isNull())
	){
		res = {"period":this.getControlPeriodSelect().getValue()};
		if (ctrl_from && !ctrl_from.isNull()){
			res.from = DateHelper.format(ctrl_from.getValue(),FieldDateTime.XHR_FORMAT);
		}
		if (ctrl_to && !ctrl_to.isNull()){
			res.to = DateHelper.format(ctrl_to.getValue(),FieldDateTime.XHR_FORMAT);
		}
	}
	*/
	return {"period":this.getControlPeriodSelect().getValue()};
}
EditPeriodDate.prototype.isNull = function(){
	return (this.getControlFrom().isNull() && this.getControlTo().isNull());
}
/**
 * @param [Array] v
 */
EditPeriodDate.prototype.setValue = function(v){
	//if (v.from)this.getControlFrom().setValue(v.from);
	//if (v.to)this.getControlTo().setValue(v.to);
	if (v.period)this.getControlPeriodSelect().setValue(v.period);
}

EditPeriodDate.prototype.setInitValue = function(v){
	this.setValue(v);
}

EditPeriodDate.prototype.reset = function(){
	//this.getControlFrom().reset();
	//this.getControlTo().reset();
	if(this.getControlPeriodSelect())this.getControlPeriodSelect().setValue("all");
}

EditPeriodDate.prototype.setCtrlDateTime = function(ctrl,dt){
	dt.setHours(0);
	dt.setMinutes(0);
	dt.setSeconds(0);
	dt.setTime(dt.getTime() + DateHelper.timeToMS(ctrl.getTimeValueStr()));
	ctrl.setValue(dt);
}

EditPeriodDate.prototype.setPredefinedPeriod = function(per){
	if (per=="all"){
		this.getControlFrom().reset();
		this.getControlTo().reset();
	}
	else if (per=="day"){
		this.setCtrlDateTime(this.getControlFrom(),DateHelper.time());
		this.setCtrlDateTime(this.getControlTo(),DateHelper.time());
	}			
	else if (per=="week"){
		this.setCtrlDateTime(this.getControlFrom(),DateHelper.weekStart());
		this.setCtrlDateTime(this.getControlTo(),DateHelper.weekEnd());
	}
	else if (per=="month"){
		this.setCtrlDateTime(this.getControlFrom(),DateHelper.monthStart());
		this.setCtrlDateTime(this.getControlTo(),DateHelper.monthEnd());	
	}
	else if (per=="quarter"){
		this.setCtrlDateTime(this.getControlFrom(),DateHelper.quarterStart());
		this.setCtrlDateTime(this.getControlTo(),DateHelper.quarterEnd());	
	}
	else if (per=="year"){
		this.setCtrlDateTime(this.getControlFrom(),DateHelper.yearStart());
		this.setCtrlDateTime(this.getControlTo(),DateHelper.yearEnd());		
	}	
}
