/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2014

 * @requires controls/WindowMessage.js
 * @requires core/ConstantManager.js 

 * @param {object} options
 * @param {string} host
 * @param {string} bsCol
 * @param {object} servVars
 * @param {string} constantXMLString XML data for model
 * @param {string} lang 
 */
function AppWin(options){

	options = options || {};	
	
	this.m_msg = new WindowMessage();
	
	var self = this;
	window.onerror = function(msg,url,line,col,error){		
		self.onError(msg,url,line,col,error);
	};

	window.getApp = function(){
		return options.app;
	}

	window.getBsCol = function(v){
		return  options.bsCol+((v!=undefined)? v.toString():"");	
	};

	window.showMsg = function(msgType,msg,callBack,timeout) {
		self.m_msg.show({
			"type":msgType,
			"text":msg,
			"callBack":callBack,
			"timeout":timeout,
			"bsCol":window.getBsCol()
		});	
	};

	window.showError = function(msg,callBack,timeout) {
		window.showMsg(self.m_msg.TP_ER,msg,callBack,timeout);
	};

	window.showWarn = function(msg,callBack,timeout) {
		window.showMsg(self.m_msg.TP_WARN,msg,callBack,timeout);
	};

	window.showNote = function(msg,callBack,timeout) {
		window.showMsg(self.m_msg.TP_NOTE,msg,callBack,timeout);
	};

	window.showOk = function(msg,callBack,timeout) {
		window.showMsg(self.m_msg.TP_OK,msg,callBack,timeout);
	};

	window.resetError = function() {
	};
	
	window.setGlobalWait = function(isWait){
		var n = CommonHelper.nd("waiting");	
		if (n && isWait){		
			DOMHelper.delClass(n,"hidden");
		}
		else if (n){
			DOMHelper.addClass(n,"hidden");
		}
	}
	
}

/* Constants */

/* protected*/


/* public methods */

AppWin.prototype.onError = function(msg,url,line,col,error) {
	var d = window.getApp().getServVar("debug");
	var m_debug = (d=="1" || d===true || d===undefined);
	var str = msg;
	//error instanceof ReferenceError
	if(m_debug){
		str = str + "\nurl: " + url + "\nline: " + line;
		if(console){
			console.log(str);
			if (error && error.stack)console.log(error.stack);
			if (console.trace)console.trace();
		}
	}
	else{
		var er_pref = "Error: ";
		if (str.substr(0,er_pref.length)==er_pref){
			str = str.substr(er_pref.length);
		}
	}	
	window.showError(str);
	
	return false;
}
