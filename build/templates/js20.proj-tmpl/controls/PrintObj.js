/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc object dialog view
 
 * @requires WindowPrint
 
 * @param {namespace} options
 * @param {string} options.templ
 * @param {Object} options.keys from grid key=value pair
 * @param {Array} options.keyIds
 * @param {Array} options.publicMethodKeyIds key ids for pulic method in same order as keys structure
 * @param {PublicMethod} options.publicMethod
 * @param {bool} [options.enabled=true]
 * @param {bool} [options.divider=false]
 * @param {string} options.winParams new window standart params location=0...
 * @param {string} options.caption
 */
function PrintObj(options){
	options = options || {};	
	
	this.setTempl(options.templ);
	this.setKeys(options.keys);
	this.setKeyIds(options.keyIds);
	this.setPublicMethodKeyIds(options.publicMethodKeyIds);
	this.setPublicMethod(options.publicMethod);
	this.setEnabled((options.enabled==undefined)? options.enabled:true);
	this.setDivider((options.divider==undefined)? options.divider:false);
	this.setWinParams(options.winParams);
		
	var self = this;
	var id = CommonHelper.uniqid();
	this.m_control = new ControlContainer(id,"li",{
		"className":(this.getEnabled()==false)? "disabled": ( (this.getDivider())? "divider":""),
		//,"attrs":{"role":"presentation"}
		"elements":[
			new Control(id+":a","a",{
				"value":options.caption,
				"events":{
					"click":function(){
						self.onClick();
					}
				},
				"attrs":{"href":"#","role":"menuitem"}
			})
		]
	});
	
}

/* Constants */


/* private members */
PrintObj.prototype.m_caption;
PrintObj.prototype.m_templ;
PrintObj.prototype.m_publicMethod;
PrintObj.prototype.m_keys;
PrintObj.prototype.m_publicMethodKeyIds;
PrintObj.prototype.m_enabled;
PrintObj.prototype.m_divider;
PrintObj.prototype.m_winParams;
PrintObj.prototype.m_control;
PrintObj.prototype.m_grid;

/* protected*/


/* public methods */
PrintObj.prototype.getCaption = function(){
	return this.m_control.getElement("a").getValue();
}
PrintObj.prototype.setCaption = function(v){
	this.m_control.getElement("a").setCaption(v)
}

PrintObj.prototype.getTempl = function(){
	return this.m_templ;
}
PrintObj.prototype.setTempl = function(v){
	this.m_templ = v;
}
PrintObj.prototype.getPublicMethod = function(){
	return this.m_publicMethod;
}
PrintObj.prototype.setPublicMethod = function(v){
	this.m_publicMethod = v;
}

PrintObj.prototype.getKeys = function(){
	if (!this.m_keys && this.m_grid){
		if (!this.m_keyIds){
			//grid keys
			return this.m_grid.getSelectedNodeKeys();
		}
		else{
			//grid specific fields
			var m = this.m_grid.getModel();
			if (m){
				var keys = {};
				this.m_grid.setModelToCurrentRow();
				var fields = m.getFields();
				for (var i=0;i<this.m_keyIds.length;i++){
					if (fields[this.m_keyIds[i]]){
						keys[this.m_keyIds[i]] = fields[this.m_keyIds[i]].getValue();
					}
				}
				return keys;
			}
		}
	}
	else if (this.m_keys){
		return this.m_keys;	
	}
	
}	
PrintObj.prototype.setKeys = function(v){
	this.m_keys = v;	
}	

PrintObj.prototype.getKeyIds = function(){
	return this.m_keyIds;	
}	
PrintObj.prototype.setKeyIds = function(v){
	this.m_keyIds = v;	
}	

PrintObj.prototype.getPublicMethodKeyIds = function(){
	return this.m_publicMethodKeyIds;	
}	
PrintObj.prototype.setPublicMethodKeyIds = function(v){
	this.m_publicMethodKeyIds = v;	
}	

PrintObj.prototype.getEnabled = function(){
	return this.m_enabled;	
}	
PrintObj.prototype.setEnabled = function(v){
	this.m_enabled = v;	
}	
PrintObj.prototype.getDivider = function(){
	return this.m_divider;	
}	
PrintObj.prototype.setDivider = function(v){
	this.m_divider = v;	
}	
PrintObj.prototype.getWinParams = function(){
	return this.m_winParams;	
}	
PrintObj.prototype.setWinParams = function(v){
	this.m_winParams = v;	
}	

PrintObj.prototype.getControl = function(){
	return this.m_control;	
}	

PrintObj.prototype.setGrid = function(v){
	this.m_grid = v;	
}	

PrintObj.prototype.onClick = function(){
	var keys = this.getKeys();
	if (keys && !CommonHelper.isEmpty(keys)){
		var pm = this.getPublicMethod();
		var pm_keys = this.getPublicMethodKeyIds();	
		var ind = 0;
		for (var id in keys){
			pm.setFieldValue(pm_keys[ind],keys[id]);
			ind++;
		}
		pm.setFieldValue("templ",this.getTempl());
		//pm.openHref(this.getViewId(),this.getWinParams());
		
		var self = this;
		pm.run({
			"viewId":"ViewHTMLXSLT",
			"retContentType":"text",
			"ok":function(resp){
				WindowPrint.show({"content":resp,"print":false,"title":self.getCaption()});
			}
		});
		
	}
}	

