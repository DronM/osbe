/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends
 * @requires core/extend.js  

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 * @param {object} options.elementClass
 */
function EditJSONContainer(id,options){
	options = options || {};	
	
	this.m_elementClass = options.elementClass;
	this.m_elementOptions = options.elementOptions;
	
	options.template = window.getApp().getTemplate("EditJSONContainer");
	
	var self = this;
	options.addElement = function(){
		this.m_container = new ControlContainer(id+":container","DIV");
		this.addElement(this.m_container);
		this.addElement(new ButtonCmd(this.getId()+":cmdAdd",{
			"title":"Добавить нового исполнителя",
			"caption":"Добавить исполнителя",
			"onClick":function(){
				var new_elem = self.createNewElement();
				self.m_container.addElement(new_elem);
				new_elem.toDOM(self.m_container.getNode());
				// Collapse on click
				   $('.panel [data-action=collapse]').click(function (e) {
				    //var n = document.getElementById(new_elem.getId()+":cmdToggle");
				    //$(n).click(function (e) {
					e.preventDefault();
					var $panelCollapse = $(this).parent().parent().parent().parent().nextAll();
					$(this).parents('.panel').toggleClass('panel-collapsed');
					$(this).toggleClass('rotate-180');

					//containerHeight(); // recalculate page height
					var availableHeight = $(window).height() - $('.page-container').offset().top - $('.navbar-fixed-bottom').outerHeight();

					$('.page-container').attr('style', 'min-height:' + availableHeight + 'px');
					$panelCollapse.slideToggle(150);
				    });
				
				//alert("Added new Element!")
			}
		}));	
	}
	
	EditJSONContainer.superclass.constructor.call(this,id,options.tagName,options);
	
	if (options.valueJSON){
		this.setValue(options.valueJSON);
	}
}
extend(EditJSONContainer,ControlContainer);

/* Constants */


/* private members */

/* protected*/
EditJSONContainer.prototype.m_container;
EditJSONContainer.prototype.m_elementClass;
EditJSONContainer.prototype.m_elementOptions;

/* public methods */
EditJSONContainer.prototype.getValue = function(){	
	return CommonHelper.serialize(this.getValueJSON());
}

EditJSONContainer.prototype.getValueJSON = function(){	
	var o_ar = [];
	for (var i=0;i<this.m_container.length;i++){		
		for (var elem_id in this.m_container[i].m_elements){
			if (this.m_container[i].m_elements[elem_id]){
				o_ar.push(this.m_container[i].m_elements[elem_id].getValueJSON());
			}
		}	
		
	}
	return o_ar;
}

EditJSONContainer.prototype.createNewElement = function(){
	var opts = (this.m_elementOptions)? CommonHelper.clone(this.m_elementOptions):{};
	var ind = this.m_container.getCount();
	var id = this.getId()+":container:"+ind;
console.log("EditJSONContainer.prototype.createNewElement ID="+id)	
	opts.cmdClose = true;
	self = this;
	opts.onCloseContractor = function(){
		self.delElement(this.getName());
		this.delDOM();
	}
	opts.templateOptions = {
		"IND":(ind+1)
	};
	var new_elem = new this.m_elementClass(id,opts);
	
	return new_elem;	
}

EditJSONContainer.prototype.setValueOrInit = function(v,isInit){
	this.m_container.clear();
	
	var o_ar;
	if (typeof(v)=="string"){
		o_ar = CommonHelper.unserialize(v);
	}
	else{
		o_ar = v;
	}
	for (var i=0;i<o_ar.length;i++){
		var new_elem = this.createNewElement();
		for (var id in o_ar[i]){			
			if (new_elem.m_elements[id]){
				if (isInit && new_elem.m_elements[id].setInitValue){
					new_elem.m_elements[id].setInitValue(o[id]);
				}
				else{
					new_elem.m_elements[id].setValue(o[id]);
				}
			}
		
		}
		this.m_container.addElement(new_elem);
	}	
}

EditJSONContainer.prototype.setValue = function(v){
	this.setValueOrInit(v,false);
}

EditJSONContainer.prototype.setInitValue = function(v){
	this.setValueOrInit(v,true);
}

EditJSONContainer.prototype.setValid = function(){
	for (var i=0;i<this.m_container.length;i++){
		var list = this.m_container[i].getElements();
		for(var id in list){
			if (list[id].setValid){
				list[id].setValid();
			}
		}	
	}
}

EditJSON.prototype.setNotValid = function(str){
	//var list = this.getElements();
	//console.log("Error:"+str)
}

EditJSONContainer.prototype.getModified = function(){
	var res = false;
	for (var i=0;i<this.m_container.length;i++){
		var list = this.m_container[i].getElements();
		for(var id in list){
			if (list[id].getModified && list[id].getModified()){
				res = true;
				break;
			}
		}	
	}
	return res;
}

EditJSONContainer.prototype.isNull = function(){
	var res = true;
	for (var i=0;i<this.m_container.length;i++){
		var list = this.m_container[i].getElements();
		for(var id in list){
			if (list[id].isNull && !list[id].isNull()){
				res = false;
				break;
			}
		}	
	}
	return res;
}
