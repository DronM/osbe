/* Copyright (c) 2010 
	Andrey Mikhalevich, Katren ltd.
*/
/*
	Kalendar - base class for date time
	KalendarDate - for date only
*/
/**
 * @requires EventHandler.js
 * @requires DateHandler.js
*/

function Kalendar(inputId,options){
	options = options||{};
	var DEF_PATTERN = 'dd/mm/yy hh:mmin:ss';
	this.formatPattern = (options.formatPattern==undefined)? DEF_PATTERN:options.formatPattern;
	this.m_timeSeconds = DateHandler.timeToSeconds(options.time || "00:00:00");
	this.m_winObj = options.winObj;
	
	if (inputId!=undefined){
		this.inputId = inputId;	
		var node = nd(this.inputId,this.getWinObjDocum());
		if (node!=undefined){
			var dt;
			if (node.value&&node.value.length>0){
				dt = DateHandler.strToDate(node.value);
				if (dt=='Invalid Date'||dt=='NaN'){
					dt = new Date();
				}
			}
			else{
				dt = new Date();
			}
			this.setCurDate(dt);
		}
	}
}

Kalendar.prototype.PIC_PREV_MONTH = 'img/pagination/page-prev.png';
Kalendar.prototype.PIC_PREV_YEAR = 'img/pagination/page-first.png';
Kalendar.prototype.PIC_NEXT_MONTH = 'img/pagination/page-next.png';
Kalendar.prototype.PIC_NEXT_YEAR = 'img/pagination/page-last.png';
Kalendar.prototype.KALENDAR_CLASS = 'pop_up_kalendar';

Kalendar.prototype.curDate;//holds current date
Kalendar.prototype.theMonths = ["Январь","Февраль","Март","Апрель","Maй","Июнь","Июль","Август",
"Сентябрь","Oктябрь","Ноябрь","Декабрь"]
Kalendar.prototype.kalendNode;

Kalendar.prototype.evOnBoxOpen;
Kalendar.prototype.evOnBoxClose;
Kalendar.prototype.evOnSelectDate;

/*
	get string or Date as arg
	and sets it as current
*/
Kalendar.prototype.setCurDate = function(str_or_date){
	if (typeof str_or_date=='string'){
		this.curDate = DateHandler.strToDate(str_or_date);
	}
	else {
		this.curDate = str_or_date;
		//new Date(str_or_date.getTime()+this.m_timeSeconds*1000);		
	}
}
/*
	returns string in user defined pattern- descr of the current date
*/
Kalendar.prototype.getCurDate = function(){
	return DateHandler.dateToStr(this.curDate,this.formatPattern);
}

Kalendar.prototype.getHTML = function(){	
	var cur_date = new Date();
	var cur_month = cur_date.getMonth();
	var cur_year = cur_date.getFullYear();
	var cur_day = cur_date.getDate();
	
	var days_descr = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
	var year = this.curDate.getFullYear();
	var sel_day = this.curDate.getDate();
	
	var date_my = this.theMonths[this.curDate.getMonth()]+' '+year;
	var month = this.curDate.getMonth();	
	var first_day = DateHandler.getFirstDay(year, month);
	var days_in_month = DateHandler.getMonthLen(year, month);
	if (first_day>0){
		//not monday
		var days_in_prev_month = DateHandler.getMonthLen(year, month-1);
	}
	kal_html = '<table class="dialogWindow kalendar">'+
		'<tbody>'+
		'<tr><th colSpan="7"><span style="float:left">Календарь</span><img id="kl_cancel" style="float:right" class="form_close" src="img/windowfiles/close.gif" alt="X"></th></tr>'+
		'<tr><td colSpan="3" align="center"><img class="kl_ctrl" id="kl_y_back" src="'+this.PIC_PREV_YEAR+'" alt="<<"></img><img id="kl_m_back" class="kl_ctrl" src="'+this.PIC_PREV_MONTH+'" alt="<"></img></td>'+
		'<td align="center"><a id="kl_menu" class="kl_ctrl">...</a></td>'+
		'<td colSpan="3" align="center"><img id="kl_m_forw" class="kl_ctrl" src="'+this.PIC_NEXT_MONTH+'" alt=">>"></img><img id="kl_y_forw" class="kl_ctrl" src="'+this.PIC_NEXT_YEAR+'" alt=">"></img></td>'+
		'</tr>'+
		'<tr><td colspan="7" align="center">'+date_my+'</td></tr>'+
		'<tr>';
		var day_class;
		for (var i = 0; i < 7; i++) {
			day_class = (i>=5)? 'kl_week_days_off':'kl_week_days';
			kal_html += '<td class="'+day_class+'">'+days_descr[i]+'</td>';
		}
		kal_html += '</tr>';
		var class_name='';
		var day=1,day_n,id,day_next_m=1;
		for (var col = 0; col < 6 && day<=days_in_month; col++) {
			kal_html+='<tr>';
			for (var row = 0; row < 7; row++) {
				if ((col==0)&&(row<first_day)){
					//not active
					class_name='out_date';
					day_n = days_in_prev_month - first_day + row+1;
					id = '';
				}
				else if (day>days_in_month){
					class_name='out_date';
					day_n = day_next_m;
					day_next_m++;
					id = '';
				}
				else{
					//active
					var off = (row>=5)? '_off':'';
					class_name='act_day'+off;
					id=' id="kl_day_'+day+'"';
					day_n = day;					
					if (year==cur_year&&month==cur_month&&day==cur_day){
						class_name+=" cur_date";
					}
					if (year==cur_year&&month==cur_month&&day==sel_day){
						class_name+=" sel_date";
					}
					
					day++;
				}
				kal_html+='<td><div style="text-align:center;" class="'+class_name+'"'+id+'>'+day_n+'</div></td>';
			}
			kal_html+='</tr>';
		}
	kal_html+='</tbody>'+
		'</table>';
	return kal_html;

}
Kalendar.prototype.hide = function(){
	this.closePopUp();
}
Kalendar.prototype.closePopUp = function(){
	var node = nd('kl_'+this.inputId,this.getWinObjDocum());	
	
	if (node!=undefined){		
		var body = document.getElementsByTagName('body')[0];
		body.removeChild(node);
		if (this.evOnBoxClose!=undefined){
			this.evOnBoxClose();
		}			
	}
}
Kalendar.prototype.assignControls = function(){
	var self = this;
	nd("kl_y_back",this.getWinObjDocum()).onclick = function(){			
		self.curDate.setFullYear(self.curDate.getFullYear()-1);
		self.refresh();
	};
	nd("kl_y_forw",this.getWinObjDocum()).onclick = function(){
		self.curDate.setFullYear(self.curDate.getFullYear()+1);
		self.refresh();
	};	
	nd("kl_m_back",this.getWinObjDocum()).onclick = function(){
		self.curDate.setMonth(self.curDate.getMonth()-1);
		self.refresh();
	};
	nd("kl_m_forw",this.getWinObjDocum()).onclick = function(){
		self.curDate.setMonth(self.curDate.getMonth()+1);
		self.refresh();
	};
	nd("kl_menu",this.getWinObjDocum()).onclick = function(){
		alert("ToDo");
	};
	//cancel
	nd("kl_cancel",this.getWinObjDocum()).onclick = function(){
		self.closePopUp();
	};	
	//day select
	var days_in_month = DateHandler.getMonthLen(this.curDate.getFullYear(),this.curDate.getMonth());
	var day_node;
	for (var i=1;i<=days_in_month;i++){
		day_node = nd("kl_day_"+i,this.getWinObjDocum());
		if (day_node!=undefined){
			day_node.onclick = function(event){				
				event = EventHandler.fixMouseEvent(event);
				self.selectDate(event.target.id.replace(/kl_day_/,""));
			};	
		}
	}
}
Kalendar.prototype.selectDate = function(day_num){
	this.setCurDate(new Date(this.curDate.getFullYear(),this.curDate.getMonth(),day_num));
	
	if (this.evOnSelectDate!=undefined){
		this.evOnSelectDate();
	}		
	if (this.inputId!=undefined){	
		var input_node = nd(this.inputId,this.getWinObjDocum());
		if (input_node!=undefined){			
			input_node.value = this.getCurDate();
			input_node.focus();
			this.closePopUp();
		}		
	}	
}
Kalendar.prototype.show = function(parent){	
	var node;
	if (parent){
		node = parent;
	}
	else{
		node = nd(this.inputId,this.getWinObjDocum());
	}
	//debugger;
	if (node!=undefined){
		//closeAllInstances(this.KALENDAR_CLASS);
		this.closePopUp();
		this.kalendNode = document.createElement('div');
		this.kalendNode.id = 'kl_'+node.id;
		this.kalendNode.className = this.KALENDAR_CLASS;
		with (this.kalendNode.style) {
			border     = "1px solid gray";
			background = "#FFFFFF";
			color      = "#000000";
			position   = "absolute";
			display    = "block";
			padding    = "2px";
			cursor     = "default";
			zIndex	   = "999999";
		}
		this.kalendNode.innerHTML = this.getHTML();
		/*
		var scrollTop = document.documentElement.scrollTop?
                document.documentElement.scrollTop:document.body.scrollTop;
		var scrollLeft = document.documentElement.scrollLeft?
                document.documentElement.scrollLeft:document.body.scrollTop;
		var rect = node.getBoundingClientRect();
		
		this.kalendNode.style.top  = (rect.top + scrollTop + node.offsetHeight+5)+ "px";
		this.kalendNode.style.left = (node.getBoundingClientRect().left+scrollLeft)+ "px";
		document.body.appendChild(this.kalendNode);
		*/
        this.kalendNode.style.top  = (findPosY(node)+ node.offsetHeight+2)+ "px";
        this.kalendNode.style.left = (findPosX(node)+ node.offsetWidth+2)+ "px";				
		this.getWinObjDocum().body.appendChild(this.kalendNode);
		
		this.assignControls();
		if (this.evOnBoxOpen!=undefined){
			this.evOnBoxOpen();
		}
		
	}	
}
Kalendar.prototype.refresh = function(){
	if (this.kalendNode!=undefined){
		this.kalendNode.innerHTML = this.getHTML();
		this.assignControls();
	}
}
Kalendar.prototype.getWinObjDocum = function(){
	if (this.m_winObj){
		return this.m_winObj.getWindowForm().document;
	}
	else{
		return window.document;
	}
}