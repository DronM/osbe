/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>

 * @class
 * @classdesc filter for a Model class
 
 * @param {object} options

*/
function ModelFilter(options){
	options = options || {};	
	
	this.setFilters(options.filters);
}

/* Constants */


/* private members */

ModelFilter.prototype.m_filters;

/* protected*/

/*
 * returns struc Filter{field,sign,val,icase}
 */
ModelFilter.prototype.getFilterVal = function(filter){
	var ctrl = filter.binding.getControl();
	if (!ctrl){
		throw Error(CommonHelper.format(this.ER_NO_CTRL,[id]));	
	}
	
	var f = filter.binding.getField();
	
	var res = {
		"field":f.getId(),
		"sign":filter.sign,
		"val":undefined,
		"icase":undefined,
		"incorrect_val":false
	};
	
	if (!ctrl.isNull()){		
		ctrl.setValid();
		try{
			var fv;
			if (!ctrl.getIsRef()){
				fv = ctrl.getValue();
			}
			else{
				var keys = ctrl.getKeys();
				for (var kid in keys){
					fv = keys[kid];
					break;
				}
				
				//@ToDo constrain to one primary key column!!!
			}
			
			f.setValue(fv);
		}
		catch(e){
			ctrl.setNotValid(e.message);
			res.incorrect_val = true;
		}
		
		res.val = f.getValueXHR();
		if (filter.sign=="lk"){
			res.val = ( (filter.lwcards)? "%":"") + res.val + ( (filter.rwcards)? "%":"")
		}
		
		res.icase = (filter.icase)? "1":"0";
	}
	else if (ctrl.getRequired() || f.getValidator().getRequired()){
		ctrl.setNotValid(f.getValidator().ER_EMPTY);
		res.incorrect_val = true;
	}
	
	return res;
}

/* public methods */

/*
@param object filter{
	@param Control control visual control
	@param CommandBinding binding
	@param string sign
	@param bool icase
	@param bool lwcards
	@param bool rwcards
}
*/
ModelFilter.prototype.setFilter = function(id,filter){
 	this.m_filters[id] = filter;
}

ModelFilter.prototype.getFilter = function(id){
 	return this.m_filters[id];
}

ModelFilter.prototype.getFilters = function(){
 	return this.m_filters;
}

ModelFilter.prototype.setFilters = function(v){
 	this.m_filters = v;
}

/**
 * @returns {int} count of set filters (not null)
 * @param {Grid} grid
 */
ModelFilter.prototype.applyFilters = function(grid){	
	var set_cnt = 0;
	for (var id in this.m_filters){
		if (this.m_filters[id].bindings){
			for (var i=0;i<this.m_filters[id].bindings.length;i++){
				var struc = this.getFilterVal(this.m_filters[id].bindings[i]);
				if (!struc.incorrect_val && struc.val!==undefined){
					grid.setFilter(struc);
					set_cnt++;
				}
				else{
					grid.unsetFilter(struc);
				}
			}
		}
		else{
			var struc = this.getFilterVal(this.m_filters[id]);
			if (!struc.incorrect_val && struc.val!==undefined){
				grid.setFilter(struc);
				set_cnt++;
			}
			else{
				grid.unsetFilter(struc);
			}			
		}
	}
	return set_cnt;
}

/**
 * @returns {int} count of set filters (not null)
 * @param {PublicMethod} pm
 */
ModelFilter.prototype.applyFiltersToPublicMethod = function(pm){	
	var set_cnt = 0;
	var contr = pm.getController();
	
	var s_fields,s_signs,s_vals,s_icases;
	var sep = contr.PARAM_FIELD_SEP_VAL;
	var incorrect_val = false;
	for (var id in this.m_filters){
		if (this.m_filters[id].bindings){
			for (var i=0;i<this.m_filters[id].bindings.length;i++){
				var struc = this.getFilterVal(this.m_filters[id].bindings[i]);
				if (struc.incorrect_val){
					incorrect_val = true;
				}
				else{
					s_fields	= ( (!s_fields)? "":s_fields+sep) + struc.field;
					s_signs		= ( (!s_signs)? "":s_signs+sep ) + struc.sign;
					s_vals		= ( (!s_vals)? "":s_vals+sep ) + struc.val;
					s_icases	= ( (!s_icases)? "":s_icases+sep ) + (struc.icase || "0");
			
					set_cnt++;
				}
			}
		}
		else{
			var struc = this.getFilterVal(this.m_filters[id]);
			if (struc.incorrect_val){
				incorrect_val = true;
			}
			else{
				s_fields	= ( (!s_fields)? "":s_fields+sep) + struc.field;
				s_signs		= ( (!s_signs)? "":s_signs+sep ) + struc.sign;
				s_vals		= ( (!s_vals)? "":s_vals+sep ) + struc.val;
				s_icases	= ( (!s_icases)? "":s_icases+sep ) + (struc.icase || "0");
		
				set_cnt++;
			}
		}
	}
	
	if (incorrect_val){
		throw Error(this.ER_INVALID_CTRL);
	}
	
	pm.setFieldValue(contr.PARAM_COND_FIELDS, s_fields);
	pm.setFieldValue(contr.PARAM_COND_SGNS, s_signs);
	pm.setFieldValue(contr.PARAM_COND_VALS, s_vals);
	pm.setFieldValue(contr.PARAM_COND_ICASE, s_icases);
	pm.setFieldValue(contr.PARAM_FIELD_SEP, sep);
	
	return set_cnt;
}

ModelFilter.prototype.resetFilters = function(grid){
	for (var id in this.m_filters){
		var bind = this.m_filters[id].binding;
				
		var ctrl = bind.getControl();
		if (!ctrl){
			throw Error(CommonHelper.format(this.ER_NO_CTRL,[id]));	
		}
					
		ctrl.reset();
		//debugger
		if (this.m_filters[id].bindings){
			for (var i=0;i<this.m_filters[id].bindings.length;i++){
				var filter = this.m_filters[id].bindings[i];
				grid.unsetFilter({
					"field":filter.binding.getField().getId(),
					"sign":filter.sign
				});
			}
		}
		else{
			var filter = this.m_filters[id];
			grid.unsetFilter({
				"field":filter.binding.getField().getId(),
				"sign":filter.sign
			});
		}
	}
}

ModelFilter.prototype.serialize = function(){
	var o = {};
	for (var id in this.m_filters){		
		var ctrl = this.m_filters[id].binding.getControl();
		if (ctrl && !ctrl.isNull()){	
			if (this.m_filters[id].bindings){
				o[id] = {"value":ctrl.getValue()};
				o[id].bindings = [];
				for (var i=0;i<this.m_filters[id].bindings.length;i++){
					var ctrl = this.m_filters[id].bindings[i].binding.getControl();
					if (ctrl && !ctrl.isNull()){
						var v = ctrl.getValue();
						if (v instanceof Date){
							v = DateHelper.format(v,FieldDateTime.XHR_FORMAT);
						}
						o[id].bindings[i] = {
							"field":this.m_filters[id].bindings[i].binding.getField().getId(),
							"sign":this.m_filters[id].bindings[i].sign,
							"value":v
						};
					}
			
				}
			}
			else{
				var v = ctrl.getValue();
				if (v instanceof Date){
					v = DateHelper.format(v,FieldDateTime.XHR_FORMAT);
				}			
				o[id] = {				
					"field":this.m_filters[id].binding.getField().getId(),
					"sign":this.m_filters[id].sign,
					"value":v
				};
			}
		}	
	}
	
	return CommonHelper.serialize(o);
}

/**
 * @returns {int} count of set filters (not null)
 * @param {string} str String with serialozed object
 */
ModelFilter.prototype.unserialize= function(str){
	var o = CommonHelper.unserialize(str);
	var set_cnt = 0;
	for (var id in this.m_filters){
		var ctrl = this.m_filters[id].binding.getControl();
		if (ctrl){
			if (o[id]){
				if (this.m_filters[id].bindings && typeof(o[id].value)!="object"){
					//ctrl.setValue(o[id].value);
					//set_cnt++;
					for (var i=0;i<this.m_filters[id].bindings.length;i++){
						ctrl = this.m_filters[id].bindings[i].binding.getControl();
						if (ctrl){
							if (o[id].bindings[i]){
								ctrl.setInitValue(o[id].bindings[i].value);
								set_cnt++;
							}
							else{
								ctrl.reset();
							}
						}
			
					}
				}
				else{			
					ctrl.setInitValue(o[id].value);
//console.log("ModelFilter.prototype.unserialize Ctrl set to ")
//console.dir(ctrl.getValue());
					set_cnt++;
				}
			}
			else{
				ctrl.reset();
			}			
		}	
	}	
	return set_cnt;
}

