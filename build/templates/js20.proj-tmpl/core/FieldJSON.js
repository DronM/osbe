/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends Field
 * @requires core/Field.js
 * @requires core/ValidatorJSON.js    
 * @class
 * @classdesc
 
 * @param {string} id - Field identifier
 * @param {namespace} options
 */
function FieldJSON(id,options){
	options = options || {};
	options.validator = options.validator || new ValidatorJSON(options);
	options.dataType = this.DT_JSON;

	FieldJSON.superclass.constructor.call(this,id,options);
}
extend(FieldJSON,Field);

FieldJSON.prototype.getValueXHR = function(){
	return ( CommonHelper.serialize(this.getValue()));
}

FieldJSON.prototype.setValue = function(id,v){
	if (!v && typeof(id)=="object"){
		this.m_value = id;	
	}
	else if (!v && typeof(id)=="string"){
		this.m_value = CommonHelper.unserialize(id);	
	}
	else if (v){
		this.m_value = this.m_value || {};
		this.m_value[id] = v;
	}
}

