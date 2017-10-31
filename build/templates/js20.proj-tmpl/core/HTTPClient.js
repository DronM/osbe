/* Copyright (c) 2017
	Andrey Mikhalevich, Katren ltd.
*/

/** JSON data type field

 * @authorth Andrey Mikhalevich <katrenplus@mail.ru>

 * @param {namespace} options
 * @param {string} options.id
 * @param {string} options.ip
 * @param {string} options.port  
 */
function HTTPClient(options){
	options = options || {};
	
	this.setId(options.id);
	this.setDescr(options.descr);
	this.setHost(options.host);
	this.setPort(options.port);
	this.setProtocol(options.protocol || this.DEF_PROTOCOL);
	
}

/* Constants */
HTTPClient.prototype.DEF_PROTOCOL = "http";

HTTPClient.prototype.m_id;
HTTPClient.prototype.m_host;
HTTPClient.prototype.m_port;
HTTPClient.prototype.m_descr;

/* private members */

/* protected*/


/* public methods */
HTTPClient.prototype.setId = function(v){
	this.m_id = v;
}

HTTPClient.prototype.getId = function(v){
	return this.m_id;
}

HTTPClient.prototype.setHost = function(v){
	this.m_host = v;
}

HTTPClient.prototype.getHost = function(v){
	return this.m_host;
}

HTTPClient.prototype.setPort = function(v){
	this.m_port = v;
}

HTTPClient.prototype.getPort = function(v){
	return this.m_port;
}

HTTPClient.prototype.setDescr = function(v){
	this.m_descr = v;
}

HTTPClient.prototype.getDescr = function(v){
	return this.m_descr;
}

HTTPClient.prototype.setProtocol = function(v){
	this.m_protocol = v;
}

HTTPClient.prototype.getProtocol = function(v){
	return this.m_protocol;
}



/*
http://192.168.1.151:55100/?id=FPrnM45&cmd=PrintCheck&params={%22checks%22:[{%22pwd%22:%22123%22,%22total%22:2000.55,%22TypeClose%22:0,%22items%22:[{%22Name%22:%22%D0%A2%D0%BE%D0%B2%D0%B0%D1%801%22,%22Price%22:500,%22Quantity%22:2,%22Department%22:0},{%22Name%22:%22%D0%A2%D0%BE%D0%B2%D0%B0%D1%802%22,%22Price%22:1000,%22Quantity%22:1,%22Department%22:0}]}]}
*/
HTTPClient.prototype.execute = function(contr,func,params,callback,fail){
	//throw Error("http://"+this.m_server+":"+this.m_port+"\?id="+this.m_id+"&cmd="+cmd+"&"+JSON.stringify(params));
	var self = this;
	var q_params = {"f":func,"params":JSON.stringify(params)};
	if (contr){
		q_params.c = contr;
	}
	var jqxhr = $.get(
		this.m_protocol+"://"+this.m_host+":"+this.m_port,q_params)
	.done(function(resp){
			//console.log("Resp:"+cor)
			//decodeURIComponent(
			var o = JSON.parse(resp);
			if (o.code!="0"){
				if (fail){
					throw Error(o.descr);
				}
				else{
					callback.call(this,o.code,o.descr,o);
				}
				
			}
			if (callback){
				callback.call(this,o.code,null,o);
			}
		}		
	)
	.fail(function(){
		if (fail){
			fail.call(this,-1,self.ER_AJAX+": "+( (self.m_descr)? self.m_descr:self.m_id));			
		}	
		else{
			throw Error(self.ER_AJAX+": "+( (self.m_descr)? self.m_descr:self.m_id));
		}	
	}
	);
}

HTTPClient.prototype.ping = function(ret,fail){
	this.execute(null,"ping",null,ret,fail);
}

