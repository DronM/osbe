/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
* @requires controls/ControlContainer.js 
*/

/* constructor */
function PeriodFilter(id,options){
	options = options || {};
	var tagName = options.tagName || this.DEF_TAG_NAME;
	options.className = options.className || this.DEF_CLASS_NAME;
	PeriodFilter.superclass.constructor.call(this,
		id,tagName,options);
	this.m_onRefresh = options.onRefresh;
	this.m_clickContext = options.clickContext;
	this.m_filter = new ListFilter();
	this.m_filter.addFilter("from",
		{"sign":"ge",
		"valueFieldId":options.valueFieldId
		}
	);
	this.m_filter.addFilter("to",
		{"sign":"le",
		"valueFieldId":options.valueFieldId
		}
	);	
		
	var DEF_DESCR_TEMPL;
	this.m_period = options.period||"day";
	if (this.m_period=="day"){
		this.m_prevPeriodTitle = "предыдущий день";
		this.m_nextPeriodTitle = "следующий день";
		DEF_DESCR_TEMPL = "d M yy, dow";
	}
	else if (this.m_period=="week"){
		this.m_prevPeriodTitle = "предыдущая неделя";
		this.m_nextPeriodTitle = "следующая неделя";
		DEF_DESCR_TEMPL = "dd/mm";
	}
	else if (this.m_period=="month"){
		this.m_prevPeriodTitle = "предыдущий месяц";
		this.m_nextPeriodTitle = "следующий месяц";
	}
	else if (this.m_period=="quater"){
		this.m_prevPeriodTitle = "предыдущий квартал";
		this.m_nextPeriodTitle = "следующий квартал";
	}	
	else if (this.m_period=="year"){
		this.m_prevPeriodTitle = "предыдущий год";
		this.m_nextPeriodTitle = "следующий год";
	}
	else{
		this.m_prevPeriodTitle = options.prevPeriodTitle;
		this.m_nextPeriodTitle = options.nextPeriodTitle;
	}
	
	this.m_descrTempl = options.descrTempl||DEF_DESCR_TEMPL;
	
	this.m_label = new Label({"tagName":"span","className":"dayText","id":"make_order_filter_l"});
	var self = this;	
	this.m_prevPeriod = new Button(id+"_prevperiod",
		{"caption":"<","attrs":{"title":this.m_prevPeriodTitle},
		"onClick":function(){
			self.setDate(new Date(self.m_dateFrom.getTime()-1*1000));
			if (self.m_onRefresh){
				self.m_onRefresh.call(self.m_clickContext);
			}
			}
		});
	
	this.m_nextPeriod = new Button(id+"_nextperiod",
		{"caption":">","attrs":{"title":this.m_nextPeriodTitle},
		"onClick":function(){
			self.setDate(new Date(self.m_dateTo.getTime()+1*1000));
			if (self.m_onRefresh){
				self.m_onRefresh.call(self.m_clickContext);
			}
		}
		});	
	
	this.addElement(this.m_prevPeriod);
	this.addElement(this.m_label);
	this.addElement(this.m_nextPeriod);
	
	options.date = options.date || new Date();
	this.m_fromH = options.fromH || 0;
	this.m_fromM = options.fromM || 0;
	this.m_fromS = options.fromS || 0;
	this.m_fromMS = options.fromMS || 0;
	this.m_toH = options.toH || 23;
	this.m_toM = options.toM || 59;
	this.m_toS = options.toS || 59;
	this.m_toMS = options.toMS || 0;
	this.m_lengthH = options.lengthH||24;
	this.m_lengthM = options.lengthM||0;
	this.m_lengthS = options.lengthS||0;
	this.setDate(options.date);	
}
extend(PeriodFilter,ControlContainer);

PeriodFilter.prototype.DEF_TAG_NAME = "div";
PeriodFilter.prototype.DEF_CLASS_NAME = 'period_filter';

PeriodFilter.prototype.m_date;
PeriodFilter.prototype.m_label;
PeriodFilter.prototype.m_prevPeriod;
PeriodFilter.prototype.m_nextPeriod;
PeriodFilter.prototype.m_filter;
PeriodFilter.prototype.m_onRefresh;
PeriodFilter.prototype.m_clickContext;
PeriodFilter.prototype.m_start;
PeriodFilter.prototype.m_fromH;
PeriodFilter.prototype.m_fromM;
PeriodFilter.prototype.m_toH;
PeriodFilter.prototype.m_toM;
PeriodFilter.prototype.m_lengthH;
PeriodFilter.prototype.m_lengthM;

PeriodFilter.prototype.setDate = function(date){
	if (this.m_period=="week"){
		this.m_dateFrom = DateHandler.weekStart(date);
		this.m_dateFrom.setHours(this.m_fromH,this.m_fromM,this.m_fromS,0);
		this.m_dateTo = DateHandler.weekEnd(date);
		this.m_dateTo.setHours(this.m_toH,this.m_toM,this.m_toS,0);
	}
	else if (this.m_period=="month"){
		this.m_dateFrom = new Date(date.getFullYear(),date.getMonth(),1);
		this.m_dateFrom.setHours(this.m_fromH,this.m_fromM,this.m_fromS,this.m_fromMS);
		this.m_dateTo = DateHandler.getLastDateOfMonth(date.getFullYear(),date.getMonth());		
		//this.m_dateTo.setHours(this.m_toH,this.m_toM,this.m_toS,this.m_toMS);
		this.m_dateTo.setHours(this.m_fromH,this.m_fromM,this.m_fromS,this.m_fromMS);
		this.m_dateTo = new Date(this.m_dateTo.getTime()+
			this.m_lengthH*60*60*1000+
			this.m_lengthM*60*1000+this.m_lengthS*1000-1000
		);		
	}
	else if (this.m_period=="quater"){
		var m1 = date.getMonth();
		if (m1<=2){
			m1 = 0;
			m2 = 2;
		}
		else if (m1<=5){
			m1 = 3;
			m2 = 5;
		}
		else if (m1<=8){
			m1 = 6;
			m2 = 8;
		}
		else{
			m1 = 9;
			m2 = 11;
		}
		this.m_dateFrom = new Date(date.getFullYear(),m1,1);
		this.m_dateFrom.setHours(this.m_fromH,this.m_fromM,this.m_fromS,this.m_fromMS);
		this.m_dateTo = DateHandler.getLastDateOfMonth(date.getFullYear(),m2);		
		this.m_dateTo.setHours(this.m_toH,this.m_toM,this.m_toS,0);
	}	
	else if (this.m_period=="year"){
		this.m_dateFrom = new Date(date.getFullYear(),0,1);
		this.m_dateFrom.setHours(this.m_fromH,this.m_fromM,this.m_fromS,this.m_fromMS);
		this.m_dateTo = DateHandler.getLastDateOfMonth(date.getFullYear(),11);
		//this.m_dateTo.setHours(this.m_toH,this.m_toM,this.m_toS,this.m_toMS);
		this.m_dateTo = new Date(this.m_dateTo.getTime()+
			this.m_lengthH*60*60*1000+
			this.m_lengthM*60*1000+this.m_lengthS*1000-1000);
		
	}
	else{
		this.m_dateFrom = date;	
		this.m_dateFrom.setHours(this.m_fromH,this.m_fromM,this.m_fromS,this.m_fromMS);
		this.m_dateTo = new Date(this.m_dateFrom.getTime()+
			this.m_lengthH*60*60*1000+
			this.m_lengthM*60*1000+this.m_lengthS*1000-1000);
	}
	
	this.m_label.setValue(this.getPeriodDescr());
}
PeriodFilter.prototype.getDateFrom = function(){
	return this.m_dateFrom;
}
PeriodFilter.prototype.getDateTo = function(){
	return this.m_dateTo;
}
PeriodFilter.prototype.getDate = function(){
	return this.getDateFrom();
}

PeriodFilter.prototype.getParams = function(struc){		
	this.m_filter.m_params["from"].descr = DateHandler.dateToStr(this.getDateFrom(),"dd/mm/yy hh:mmin:ss");
	this.m_filter.m_params["to"].descr = DateHandler.dateToStr(this.getDateTo(),"dd/mm/yy hh:mmin:ss");
	this.m_filter.getParams(struc);
}
PeriodFilter.prototype.setOnRefresh = function(onGridRefresh){
	this.m_onRefresh = onGridRefresh;
}
PeriodFilter.prototype.setClickContext = function(clickContext){
	this.m_clickContext = clickContext;
}
PeriodFilter.prototype.toDOM = function(parent){
	PeriodFilter.superclass.toDOM.call(this,parent);
	
	var self = this;
	EventHandler.addEvent(this.m_label.m_node,"click",
	function(event){
		//event = EventHandler.fixMouseEvent(event);
		var kal = new Kalendar(self.m_label.m_node.id);
		kal.setCurDate(self.m_dateFrom);
		kal.evOnSelectDate = function(){
			self.setDate(this.curDate);			
			if (self.m_onRefresh){
				self.m_onRefresh.call(self.m_clickContext);
			}
			kal.hide();	
		}
		kal.show();	
	}
	,false);		
}
PeriodFilter.prototype.getPeriodDescr = function(){
	var res;
	if (this.m_period=="day"){
		var t = this.m_descrTempl;
		var dow_p = t.indexOf("dow");
		if (dow_p>=0){
			t = t.substr(0,dow_p);
		}
		res = DateHandler.dateToStr(this.m_dateFrom,t);
		if (dow_p>=0){
			var days = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
			res+=days[this.m_dateFrom.getDay()];
		}		
	}
	else if (this.m_period=="week"){
		res = DateHandler.dateToStr(this.m_dateFrom,this.m_descrTempl)+
			" - "+
			DateHandler.dateToStr(this.m_dateTo,this.m_descrTempl);
	}
	else if (this.m_period=="quater"){
		var q_descr = [];
		q_descr[0] = "1 квартал";
		q_descr[3] = "2 квартал";
		q_descr[6] = "3 квартал";
		q_descr[9] = "4 квартал";		
		res = q_descr[this.m_dateFrom.getMonth()]+" "+this.m_dateFrom.getFullYear();
	}	
	else if (this.m_period=="month"){
		var mon_str = [];
		mon_str[0] = "Январь";
		mon_str[1] = "Февраль";
		mon_str[2] = "Март";
		mon_str[3] = "Апрель";
		mon_str[4] = "Май";
		mon_str[5] = "Июнь";
		mon_str[6] = "Июль";
		mon_str[7] = "Август";
		mon_str[8] = "Сентябрь";
		mon_str[9] = "Октябрь";
		mon_str[10] = "Ноябрь";
		mon_str[11] = "Декабрь";		
		res = mon_str[this.m_dateFrom.getMonth()]+" "+this.m_dateFrom.getFullYear();
	}
	else if (this.m_period=="year"){
		res = this.m_dateFrom.getFullYear();
	}
	return res;
}
PeriodFilter.prototype.addFilterControl = function(control,filter){		
	this.m_filter.addFilter(control.getId(),filter);
	this.addElement(control);
}
PeriodFilter.prototype.getFilterControlById = function(id){		
	return this.m_filter.getFilterById(id);
}
PeriodFilter.prototype.unsetFilterControlById = function(id){
	this.m_filter.unsetFilterById(id);
}
PeriodFilter.prototype.getControlFrom = function(id){
	//return;
}
PeriodFilter.prototype.getControlTo = function(id){
	//return;
}
