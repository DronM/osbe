/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc Constant managing class
 
 * @param {Object} options
 * @param {object} options.values
 * @param {string} options.XMLString
 */
function ConstantManager(options){
	
	options = options || {};
	
	this.m_values = options.values || {};
	
	if (options.XMLString){
		this.fillFromXML(options.XMLString);
	}
	
}

/* private */
ConstantManager.prototype.m_values;

ConstantManager.prototype.fillFromXML = function(xml){
	var m = new ModelXML("ConstantValueList_Model",{
		"data":xml,
		"fields":{"id":new FieldString(),
			"val":new FieldString(),
			"val_type":new FieldString()
			}
		});
	while(m.getNextRow()){
		var v_t = m.getFieldValue("val_type");
		var v = m.getFieldValue("val");
		var v_class;
		var v_id = m.getFieldValue("id");
		if (v_t == "Int"){
			v_class = FieldInt;
		}
		else if (v_t == "Float"){
			v_class = FieldFloat;
		}				
		else if (v_t == "DateTime"){
			v_class = FieldDateTime;
		}						
		else if (v_t == "Date"){
			v_class = FieldDate;
		}								
		else{
			v_class = FieldString;
		}
		this.m_values[v_id] = new v_class(v_id,{"value":v});
	}	
}


/* Public */

/*
@param object constants[id]=null
on return it is filled with values from server or from cach
*/
ConstantManager.prototype.get = function(constants){	
	var not_found = "";
	var not_found_ar = [];
	var QUERY_SEP = ",";
	for (var id in constants){
		if (this.m_values[id]){
			constants[id] = this.m_values[id];
		}
		else{
			//not found
			not_found+= (not_found=="")? "":QUERY_SEP;
			not_found+= id;			
			not_found_ar.push(id);
		}
	}
	
	if (not_found!=""){
		var self = this;
		var pm = (new Constant_Controller()).getPublicMethod("get_values");
		pm.setFieldValue("id_list",not_found);
		pm.run({
			"async":false,
			"ok":function(resp){			
				self.fillFromXML(resp.getModelData("ConstantValueList_Model"));
				for (var i=0;i<not_found_ar.length;i++){
					constants[not_found_ar[i]] = self.m_values[not_found_ar[i]];
				}
				
			},
			"fail":function(resp,errCode,errStr){
				throw Error(errStr);
			}
		});
	}	
}


ConstantManager.prototype.set = function(constants){	
}

