/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc

 * @requires
  
 * @param {Object} options
 * @param {Object} options.keys key=value pairs
 * @param {string} options.descr
 */
function RefType(options){
	options = options || {};	

	this.setKeys(options.keys);
	this.setDescr(options.descr);		
}

/* Constants */


/* private members */
RefType.prototype.m_keys;
RefType.prototype.m_descr;

/* protected*/


/* public methods */
RefType.prototype.setKeys = function(v){
	this.m_keys = v;
}
RefType.prototype.getKeys = function(){
	return this.m_keys;
}
RefType.prototype.setDescr = function(v){
	this.m_descr = v;
}
RefType.prototype.getDescr = function(){
	return this.m_descr;
}
RefType.prototype.getKey = function(v){
	var val;
	if (this.m_keys && v){
		val = this.m_keys[v];
	}
	else if (this.m_keys && !v){
		for(var k in this.m_keys){
			val = this.m_keys[k];
			break;
		}
	
	}
	return val;
}

RefType.prototype.isNull = function(){
	return CommonHelper.isEmpty(this.getKeys());
}

RefType.prototype.toJSON = function(){
	//return {"keys":this.getKeys(),"descr":this.getDescr()};
	return {
		"RefType":{
			"keys":this.getKeys(),
			"descr":this.getDescr()
		}
	}
	;
}
