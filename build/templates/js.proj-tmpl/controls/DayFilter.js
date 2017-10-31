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
function DayFilter(id,options){
	options = options || {};
	var tagName = options.tagName || this.DEF_TAG_NAME;
	options.className = options.className || this.DEF_CLASS_NAME;
	DayFilter.superclass.constructor.call(this,
		id,tagName,options);
	
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
	
	this.m_label = new Label({"tagName":"span","className":"dayText"});
	EventHandler.addEvent(this.m_label.m_node,"dblclick",
	function(event){
		//event = EventHandler.fixMouseEvent(event);
		//var kal = new Kalendar();
		//kal.show();	
	}
	,false);	
	var self = this;
	
	this.m_prevDate = new Button(id+"_prevDate",
		{"caption":"<",
		"onClick":function(){
			var date = self.getDate();
			date.setDate(date.getDate()-1);
			self.setDate(date);
			self.m_onRefresh.call(self.m_clickContext);
			}
		});
	
	this.m_nextDate = new Button(id+"_nextDate",
		{"caption":">",
		"onClick":function(){
			var date = self.getDate();
			date.setDate(date.getDate()+1);
			self.setDate(date);
			self.m_onRefresh.call(self.m_clickContext);
		}
		});	
	
	this.addElement(this.m_prevDate);
	this.addElement(this.m_label);
	this.addElement(this.m_nextDate);
	
	options.date = options.date || new Date();
	this.m_showDayOfWeek = options.showDayOfWeek || this.DEF_SHOW_DAY_OF_WEEK;
	this.setDate(options.date);
	
}
extend(DayFilter,ControlContainer);

DayFilter.prototype.DEF_TAG_NAME = "div";
DayFilter.prototype.DEF_CLASS_NAME = 'day_filter';
DayFilter.prototype.DEF_SHOW_DAY_OF_WEEK = true;

DayFilter.prototype.m_date;
DayFilter.prototype.m_label;
DayFilter.prototype.m_prevDate;
DayFilter.prototype.m_nextDate;
DayFilter.prototype.m_filter;
DayFilter.prototype.m_onRefresh;
DayFilter.prototype.m_clickContext;
DayFilter.prototype.m_showDayOfWeek;

DayFilter.prototype.setDate = function(date){
	this.m_date = DateHandler.getStartOfDate(date);
	var cap = DateHandler.dateToStr(date,"d M yy");
	if (this.m_showDayOfWeek){
		var days = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
		cap+=', '+days[date.getDay()];
	}
	this.m_label.setValue(cap);
}
DayFilter.prototype.getDate = function(){
	return this.m_date;
}
DayFilter.prototype.getParams = function(struc){		
	var date = this.getDate();	
	this.m_filter.m_params["from"].descr = DateHandler.dateToStr(DateHandler.getStartOfDate(date),"dd/mm/yy hh:mmin:ss");
	this.m_filter.m_params["to"].descr = DateHandler.dateToStr(DateHandler.getEndOfDate(date),"dd/mm/yy hh:mmin:ss");
	this.m_filter.getParams(struc);
}
DayFilter.prototype.setOnRefresh = function(onGridRefresh){
	this.m_onRefresh = onGridRefresh;
}
DayFilter.prototype.setClickContext = function(clickContext){
	this.m_clickContext = clickContext;
}
