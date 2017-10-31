/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends
 * @requires core/extend.js  

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {namespace} options
 * @param {string} options.className

 * @param {string} options.itemTagName 
 * @param {string} options.itemClass
 * @param {string} options.itemActiveClass
 * @param {function} options.onItemSelected
 */
function BreadCrum(id,options){
	options = options || {};	
	
	options.className = options.className || this.DEF_CLASS;
	
	this.setItemTagName(options.itemTagName || this.DEF_ITEM_TAG_NAME);
	this.setItemClass(options.itemClass || this.DEF_ITEM_CLASS);
	this.setItemActiveClass(options.itemActiveClass || this.DEF_ITEM_ACTIVE_CLASS);
	this.setOnItemSelected(options.onItemSelected);
	
	BreadCrum.superclass.constructor.call(this,id,options.tagName || this.DEF_TAG_NAME,options);
	
	this.addItem({"id":this.ROOT_ITEM_ID,"caption":this.ROOT_NODE_CAP});
}
extend(BreadCrum,ControlContainer);

/* Constants */
BreadCrum.prototype.DEF_TAG_NAME = "ul";
BreadCrum.prototype.DEF_ITEM_TAG_NAME = "li";
BreadCrum.prototype.DEF_CLASS = "breadcrumb";
BreadCrum.prototype.DEF_ITEM_CLASS = "breadcrumb-item";
BreadCrum.prototype.DEF_ITEM_ACTIVE_CLASS = "active";
BreadCrum.prototype.ROOT_ITEM_ID = "root";

/* private members */
BreadCrum.prototype.m_itemTagName;
BreadCrum.prototype.m_itemClass;
BreadCrum.prototype.m_itemActiveClass;
BreadCrum.prototype.m_onItemSelected;

/* protected*/


/* public methods */
BreadCrum.prototype.setItemClass = function(v){
	this.m_itemClass = v;
}
BreadCrum.prototype.getItemClass = function(){
	return this.m_itemClass;
}
BreadCrum.prototype.setItemActiveClass = function(v){
	this.m_itemActiveClass = v;
}
BreadCrum.prototype.getItemActiveClass = function(){
	return this.m_itemActiveClass;
}
BreadCrum.prototype.setItemTagName = function(v){
	this.m_itemTagName = v;
}
BreadCrum.prototype.getItemTagName = function(){
	return this.m_itemTagName;
}
BreadCrum.prototype.setOnItemSelected = function(v){
	this.m_onItemSelected = v;
}
BreadCrum.prototype.getOnItemSelected = function(){
	return this.m_onItemSelected;
}

/**
 * @public
 * @param {object} item {caption,id} 
 */
BreadCrum.prototype.addItem = function(item){
	var self = this;
	this.addElement(
		new Control(this.getId()+":"+item.id,this.getItemTagName(),{
			"className":this.getItemClass(),
			"value":item.caption,
			"events":{
				"onclick":function(e){
					self.m_onItemSelected(e.target.getAttribute("name"));
				}
			}
		})
	);
}
/**
 * @public
 * @param {string} id
 */
BreadCrum.prototype.delItem = function(id){	
	var found = false;
	var new_elements = {};
	for (var el_id in this.m_elements){
		if (!found){
			if (el_id==id)found = true;
			new_elements[el_id] = this.m_elements[el_id];			
		}		
	}
	this.clear();
	this.m_elements = new_elements;
	this.toDOM();
}

/**
 * @public
 * @param {string} [sep="/"]
 */
BreadCrum.prototype.getCrumbs = function(sep){	
	sep = (sep!=undefined)? sep:"/";
	var res = "";
	for (var el_id in this.m_elements){
		if (el_id!=this.ROOT_ITEM_ID){
			res+= (res=="")? "":sep;
			res+=el_id;
		}
	}
	return res;
}
