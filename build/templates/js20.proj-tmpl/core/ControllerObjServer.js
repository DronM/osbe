/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends ControllerObj
 * @requires core/extend.js
 * @requires core/ControllerObj.js
 * @requires core/PublicMethodServer.js           

 * @class
 * @classdesc
 
 * @param {namespace} options
 * @param {ServConnector} options.servConnector 
 */
function ControllerObjServer(options){
	options = options || {};	
	
	options.publicMethodClass = options.publicMethodClass || PublicMethodServer;
	
	this.setServConnector(options.servConnector);
	
	ControllerObjServer.superclass.constructor.call(this,options);
}
extend(ControllerObjServer,ControllerObj);

/* Constants */
ControllerObjServer.prototype.PARAM_DEF_VIEW = "ViewXML";
ControllerObjServer.prototype.PARAM_CONTROLLER = "c";
ControllerObjServer.prototype.PARAM_METH = "f";
ControllerObjServer.prototype.PARAM_VIEW = "v";


/* private members */
ControllerObjServer.prototype.m_servConnector;


/* protected*/
ControllerObjServer.prototype.addDefParams = function(pm){	
	pm.addField(new FieldString(this.PARAM_CONTROLLER,{"value":this.getId()}));
	pm.addField(new FieldString(this.PARAM_METH,{"value":pm.getId()}));
	pm.addField(new FieldString(this.PARAM_VIEW,{"value":this.PARAM_VIEW_VALUE}));
}


ControllerObjServer.prototype.getParams = function(methId,viewId){
	var params={};
	var pm = this.getPublicMethod(methId);		
	//debugger;
	params[this.PARAM_CONTROLLER] = this.getId();
	params[this.PARAM_METH] = methId;
	params[this.PARAM_VIEW] = viewId || this.PARAM_DEF_VIEW;
	
	var set_par_cnt = 0,par_cnt=0;
		
	for (var id in pm.getFields()){
		var f = pm.getField(id);
		var is_null = f.isNull();
		//console.log("Controller.prototype.getParams field="+id+" is_set="+is_set+" is_null="+f.isNull());
		if (is_null && f.getValidator().getRequired()){
			//not from gui, gui has its own validation
			throw Error(CommonHelper.format(this.ER_EMPTY,Array(this.getId(),methId,f.getId())));
		}
		
		/*
		if (!is_null || (is_null && pm.getSendNulls())){
			params[id] = f.getValueXHR();
			set_par_cnt++;
		}
		*/
		
		if (f.isSet()){
			params[id] = f.getValueXHR();
		}
		
		par_cnt++;
	}
	
	/*
	if (par_cnt && !set_par_cnt){
		return null;
	}
	*/
	return params;
}


/* public methods */
ControllerObjServer.prototype.getServConnector = function(){
	return (this.m_servConnector)? this.m_servConnector:window.getApp().getServConnector();
}
ControllerObjServer.prototype.setServConnector = function(v){
	this.m_servConnector = v;
}

/**
 * @param {string} methId Method identifier
 * @param {object} options
 * @param {bool} [options.requestType=true],
 * @param {bool} [options.async=true]
 * @param {function} options.fail Arguments resp,errCode,errStr,requestId
 * @param {function} options.all Arguments resp,errCode,errStr,requestId 
 * @param {function} options.ok Arguments {Response} resp, {string} requestId
 * @param {string} [retContentType=xml]: Return type. Can be one of: xml||text||json
 * @param {string} enctype Encoding for post requests
*/
ControllerObjServer.prototype.run = function(methId,options){
	options = options || {};
	var meth = this.getPublicMethod(methId);
	
	if (options.requestType==undefined){
		options.requestType = (meth.getRequestType()!=undefined)? meth.getRequestType():"get";
	}
	if (options.async==undefined){
		options.async = (meth.getAsync()!=undefined)? meth.getAsync():true;
	}
	
	options.retContentType = options.retContentType || "xml";
	
	var self = this;
	options.fail = options.fail || function(resp,errCode,errStr){
		window.showError(errCode+" "+errStr);
	};
		
	var params = this.getParams(methId,options.viewId);
	//template
	if(options.t){
		params.t = options.t;
	}
	var conn = this.getServConnector();
	var con_func = (options.requestType=="post")? conn.sendPost : conn.sendGet;
	
	this.m_resp = null;
	
	if (!options.async){
		window.setGlobalWait(true);
	}
		
	return con_func.call(conn,
		params,
		options.async,
		function(errCode,errStr,resp,requestId){
		
			if (!options.async){
				window.setGlobalWait(false);
			}
		
			if (errCode!=0){
				//Error
				options.fail.call(self,resp,errCode,errStr,requestId);
			}
			else if (options.ok){
				//success user function
				self.m_resp = requestId;
				options.ok.call(self,resp,requestId);
			}
			else{
				//success no func
				self.m_resp = resp;
			}
			
			if (options.all){
				options.all.call(self,resp,errCode,errStr,requestId);
			}				
			
		},
		options.retContentType,
		options.enctype
	);
	
	//return this.m_resp;	
}

ControllerObjServer.prototype.download = function(methId,viewId){
	var params = this.getParams(methId,viewId);
	var form = $('<form></form>').attr('action', window.getApp().getServConnector().getScript()).attr('method', 'post');
	for (var id in params){
		form.append($("<input></input>").attr('type', 'hidden').attr('name', id).attr('value', params[id]));
	}

	form.appendTo('body').submit().remove();
}

ControllerObjServer.prototype.openHref = function(methId,viewId,winParams){
	var meth = this.getPublicMethod(methId);
	window.getApp().getServConnector().openHref(this.getParams(methId,viewId),winParams);
}
