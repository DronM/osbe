/* Copyright (c) 2016 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
/** Requirements
 * @requires 
 * @requires core/extend.js  
*/

/* constructor
@param string id
@param object options{

}
*/
function EquipServer(options){
	options = options || {};
	
	this.setId(options.id);
	this.setServer(options.server);
	this.setPort(options.port);
	
	if (this.m_id){
		this.setEnabled(1);
	}
}

/* Constants */


/* private members */

/* protected*/


/* public methods */
EquipServer.prototype.setId = function(v){
	this.m_id = v;
}
EquipServer.prototype.setServer = function(v){
	this.m_server = v;
}
EquipServer.prototype.setPort = function(v){
	this.m_port = v;
}



EquipServer.prototype.showProperties = function(){
	this.execute("showProperties","");
}

EquipServer.prototype.setEnabled = function(val){
	this.execute("setEnabled",{"val":parseInt(val)});
}

EquipServer.prototype.getEnabled = function(callback){
	this.execute("getEnabled",null,callback);
}

EquipServer.prototype.printX = function(pwd){
	this.execute("printX",{"pwd":pwd});
}

EquipServer.prototype.printZ = function(pwd){
	this.execute("printZ",{"pwd":pwd});
}

EquipServer.prototype.printCheck = function(paramStruc){
	this.execute("printCheck",paramStruc);
}
/*
http://192.168.1.151:55100/?id=FPrnM45&cmd=PrintCheck&params={%22checks%22:[{%22pwd%22:%22123%22,%22total%22:2000.55,%22TypeClose%22:0,%22items%22:[{%22Name%22:%22%D0%A2%D0%BE%D0%B2%D0%B0%D1%801%22,%22Price%22:500,%22Quantity%22:2,%22Department%22:0},{%22Name%22:%22%D0%A2%D0%BE%D0%B2%D0%B0%D1%802%22,%22Price%22:1000,%22Quantity%22:1,%22Department%22:0}]}]}
*/
EquipServer.prototype.execute = function(cmd,params,callback){
	//throw Error("http://"+this.m_server+":"+this.m_port+"\?id="+this.m_id+"&cmd="+cmd+"&"+JSON.stringify(params));
	var jqxhr = $.get(
		"http://"+this.m_server+":"+this.m_port,
		{"id":this.m_id,"cmd":cmd,"params":JSON.stringify(params)}
	)
	.done(function(resp){
			var o = JSON.parse(resp);
			if (o.code!="0"){
				window.showError(decodeURIComponent(o.descr));
			}
			if (callback){
				callback.call(this);
			}
		}		
	)
	.fail(function(){
		window.showError("Ошибка связи с ККМ.");
	}
	);
}
EquipServer.prototype.getEnabled = function(){
	return true;
}
