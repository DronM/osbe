/* Copyright (c) 2016 
	Andrey Mikhalevich, Katren ltd.
*/
/*
	class	
	ConstantHelper
	
*/
/**
*/

/*
@param ServConnector con
*/
function ConstantManager(con,options){
	
	options = options || {};
	
	this.m_connection = con;
	
	this.m_values = options.values || {};
	
	if (options.XMLString){
		this.fillFromXML(options.XMLString);
	}
	
}

/* private */
ConstantManager.prototype.m_values;
ConstantManager.prototype.m_connection;

ConstantManager.prototype.initController = function(){
	this.m_controller = new Constant_Controller(this.m_connection);
}

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
	var QUERY_SEP = ",";
	for (var id in constants){
		if (this.m_values[id]){
			constants[id] = this.m_values[id];
		}
		else{
			//not found
			not_found+= (not_found=="")? "":QUERY_SEP;
			not_found+= id;			
		}
	}
	
	if (not_found!=""){
		if(!this.m_controller) this.initController();
	
		var self = this;
		var pm = this.m_controller.getPublicMethod("get_values");
		pm.setFieldValue("id_list",not_found);
		this.m_controller.run("get_values",{
			"async":false,
			"ok":function(resp){
				self.fillFromXML(resp.getModelData("ConstantList_Model"));
				
			},
			"fail":function(resp,errCode,errStr){
				throw Error(errStr);
			}
		});
	}	
}


ConstantManager.prototype.set = function(constants){	
}

