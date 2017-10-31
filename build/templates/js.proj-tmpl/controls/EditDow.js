/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
*/

/* constructor */
function EditDow(id,options){
	options = options || {};
	options.className = options.className||"dow_select";
	options.attrs=options.attrs||{};
	var disabled = (options.attrs.disabled);
	
	EditDow.superclass.constructor.call(this,
		id,"div",options);
		
	var name = options.name;
	if (name==undefined && options.attrs && options.attrs.name){
		name = options.attrs.name;
	}	
	this.setAttr("name",name || id);
	var self = this;
	this.m_onClick = function(e){
		e = EventHandler.fixMouseEvent(e);
		self.selectDow(e.target.id);		
	}
	
	this.m_days=options.days;
	for (var i=0;i<this.m_days.length;i++){
		this.m_days[i].control=new Control(id+"_dow_"+i,"div",{
			"attrs":{"val":this.m_days[i].value,"class":"dow_day"},
			"value":this.m_days[i].descr,
			});
	}
}
extend(EditDow,Control);

EditDow.prototype.CLASS_SELECTED = "dow_celected";

EditDow.prototype.toDOM = function(parent){
	EditDow.superclass.toDOM.call(this,parent);
	var self = this;
	for (var i=0;i<this.m_days.length;i++){
		this.m_days[i].control.toDOM(this.m_node);
		EventHandler.addEvent(this.m_node,"click",this.m_onClick);
	}	
}
EditDow.prototype.removeDOM = function(){
	for (var i=0;i<this.m_days.length;i++){
		EventHandler.removeEvent(this.m_node,"click",this.m_onClick);
		this.m_days[i].control.removeDOM();
	}		
	EditDow.superclass.removeDOM.call(this);
}

EditDow.prototype.selectDow = function(nodeId){
	var n = nd(nodeId);
	if (n){
		if (DOMHandler.hasClass(n,this.CLASS_SELECTED)){
			DOMHandler.removeClass(n,this.CLASS_SELECTED);
		}
		else{
			//this.m_val = DOMHandler.getAttr(n,"val");
			DOMHandler.addClass(n,this.CLASS_SELECTED);
		}
	}
}
EditDow.prototype.setValue = function(newValue){
	if (newValue){
		for (var i=0;i<this.m_days.length;i++){
			for (var j=0;j<newValue.length;j++){
				if (this.m_days[i].control.getAttr("val")==newValue[j]){
					this.selectDow(this.m_days[i].control.getId());
				}
			}
		}
	}
}
EditDow.prototype.getValue = function(){
	var sel = DOMHandler.getElementsByAttr(this.CLASS_SELECTED,this.m_node,"class",false,"div");
	var val="";
	for (var i=0;i<sel.length;i++){
		val+=((val=="")? "":",")+DOMHandler.getAttr(sel[i],"val");
	}
	return "{"+val+"}";
	//return this.m_val;
}
EditDow.prototype.validate = function(val){
	return val;
}
EditDow.prototype.setEnabled = function(val){
	EditDow.superclass.setEnabled.call(this,val);
	if (this.m_days){
		for (var i=0;i<this.m_days.length;i++){
			this.m_days[i].control.toDOM(this.m_node);
			if (val){
				EventHandler.addEvent(this.m_node,"click",this.m_onClick);
			}
			else{
				EventHandler.removeEvent(this.m_node,"click",this.m_onClick);
			}
		}		
	}
}