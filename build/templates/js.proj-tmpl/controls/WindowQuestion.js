/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
//ф
/** Requirements
*/

/* constructor */
var WindowQuestion = {
	RES_YES:0,
	RES_NO:1,
	RES_CANCEL:2,
	show:function(options){
		options = options || {};
		var yes = options.yes || true;
		var no = options.no || true;
		var cancel = options.cancel || false;
		var timeout = options.timeout || 0;
		var w;
		if (!options.winObj||!options.winObj.m_WindowForm){
			w = window;
		}
		else{
			w = options.winObj.m_WindowForm;
		}
		/*
		var f = new WindowFormModalDD({"caption":"Подтверждение",
			"center":true,"width":300,"height":150});		
		var v = new Confirm_View(uuid(),{
				"text":options.text,
				"onClose":function(res){
					f.close();
					delete f;					
					
					return res;
				}
				});		
		f.open();
		v.toDOM(f.getContentParent());
		f.setFocus();
		*/
		
		if (options.callBack){
			var res = w.confirm(options.text);
			options.callBack((res)? this.RES_YES:this.RES_NO);
		}
		else{
			var res = w.confirm(options.text);
			if (res){
				return this.RES_YES;
			}
			else{
				return this.RES_NO;
			}		
		}
	}
}