/* Copyright (c) 2010 
	Andrey Mikhalevich, Katren ltd.
*/
/*
	class	
	DateHandler
*/
//пп
/**
 * @requires main.js
*/

var DateHandler = {
	addZeroTodate:function(arg){
		var s = arg.toString();
		return ((s.length<2)? '0':'')+s;
	},
	/* 07:00 -->> 7*60*60+0*60 */
	timeToSeconds:function(timeStr){
		if (timeStr==undefined){
			return 0;
		}
		var h,m;
		var time_ar = timeStr.split(":");
		var h = 0;
		var m = 0;
		var s = 0;

		if (time_ar.length>=1){
			h = parseInt(time_ar[0][0],10)*10+
				parseInt(time_ar[0][1],10)
		}		
		
		if (time_ar.length>=2){
			m = parseInt(time_ar[1][0],10)*10+
				parseInt(time_ar[1][1],10)
		}		
		if (time_ar.length>=3){
			s = parseInt(time_ar[2][0],10)*10+
				parseInt(time_ar[2][1],10)
		}
		return (h*60*60+m*60+s);
	},
	/* 07:01:05 -->> 7*60*60*1000 + 1*60*1000 + 5*1000 */
	timeToMS:function(timeStr){
		if (timeStr==undefined){
			return 0;
		}
		var h,m;
		var time_ar = timeStr.split(":");
		var h = 0;
		var m = 0;
		var s = 0;

		if (time_ar.length>=1){
			h = parseInt(time_ar[0][0],10)*10+
				parseInt(time_ar[0][1],10);
		}		
		
		if (time_ar.length>=2){
			m = parseInt(time_ar[1][0],10)*10+
				parseInt(time_ar[1][1],10);
		}		
		if (time_ar.length>=3){
			s = parseInt(time_ar[2][0],10)*10+
				parseInt(time_ar[2][1],10);
		}
		return (h*60*60*1000 + m*60*1000 + s*1000);
	},	
		
	dateToStr:function(dt,pattern){
		if (dt==undefined){
			dt = new Date();
		}
		if (pattern!=undefined){
			var mon_str = [];
			mon_str[0] = "Января";
			mon_str[1] = "Февраля";
			mon_str[2] = "Марта";
			mon_str[3] = "Апреля";
			mon_str[4] = "Мая";
			mon_str[5] = "Июня";
			mon_str[6] = "Июля";
			mon_str[7] = "Августа";
			mon_str[8] = "Сентября";
			mon_str[9] = "Октября";
			mon_str[10] = "Ноября";
			mon_str[11] = "Декабря";
			var s = pattern.replace(/dd/,this.addZeroTodate(dt.getDate()));
			s = s.replace(/d/,dt.getDate());
			s = s.replace(/M/,mon_str[dt.getMonth()]);
			s = s.replace(/mmin/,this.addZeroTodate(dt.getMinutes()));
			s = s.replace(/mm/,this.addZeroTodate(dt.getMonth()+1));
			s = s.replace(/min/,dt.getMinutes());			
			s = s.replace(/m/,dt.getMonth()+1);			
			s = s.replace(/yy/,dt.getFullYear());
			s = s.replace(/y/,dt.getFullYear()-2000);
			s = s.replace(/hh/,this.addZeroTodate(dt.getHours()));			
			s = s.replace(/ss/,this.addZeroTodate(dt.getSeconds()));
			return s;
		}
	},
	getLastDateOfMonth : function(theYear, theMonth){
		if (theYear==undefined || theMonth==undefined){
			var d = new Date();
			theMonth = (theMonth==undefined)? d.getMonth():theMonth;
			theYear = (theYear==undefined)? d.getFullYear():theYear;
		}
		var last_day = this.getMonthLen(theYear, theMonth);
		return new Date(theYear,theMonth,last_day,23,59,59,999);
	},
	getEndOfDate:function(date){
		if (date==undefined){
			date = new Date();
		}
		return new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59,999);
	},
	getStartOfDate:function(date){
		if (!date){
			date = new Date();
		}
		return new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0,0);
	},	
	getFirstDateOfMonth : function(theYear, theMonth){
		if (theYear==undefined || theMonth==undefined){
			var d = new Date();
			theMonth = (theMonth==undefined)? d.getMonth():theMonth;
			theYear = (theYear==undefined)? d.getFullYear():theYear;
		}
		return new Date(theYear,theMonth,1);
	},
	getFirstDateOfQuater : function(theYear, theMonth){
		if (theYear==undefined || theMonth==undefined){
			var d = new Date();
			theMonth = (theMonth==undefined)? 0:theMonth;
			theYear = (theYear==undefined)? d.getFullYear():theYear;
		}
		if (theMonth==1||theMonth==2){
			theMonth=0;
		}
		else if (theMonth==4||theMonth==5){
			theMonth=3;
		}
		else if (theMonth==7||theMonth==8){
			theMonth=6;
		}
		else if (theMonth==10||theMonth==11){
			theMonth=9;
		};
		return new Date(theYear,theMonth,1);
	},	
	getLastDateOfQuater : function(theYear, theMonth){
		if (theYear==undefined || theMonth==undefined){
			var d = new Date();
			theMonth = (theMonth==undefined)? 0:theMonth;
			theYear = (theYear==undefined)? d.getFullYear():theYear;
		}
		if (theMonth==0||theMonth==1){
			theMonth=2;
		}
		else if (theMonth==3||theMonth==4){
			theMonth=5;
		}
		else if (theMonth==6||theMonth==7){
			theMonth=8;
		}
		else if (theMonth==9||theMonth==10){
			theMonth=11;
		};
		var last_day = this.getMonthLen(theYear, theMonth);
		return new Date(theYear,theMonth,last_day,23,59,59,999);
	},	
	
	getFirstDay : function(theYear, theMonth){
		var firstDate = this.getFirstDateOfMonth(theYear, theMonth);
		var day = firstDate.getDay();
		day--;
		if (day<0)day=6;	
		return day;
	},
	getMonthLen : function(theYear, theMonth) {
		var oneDay = 1000 * 60 * 60 * 24;
		var thisMonth = new Date(theYear, theMonth, 1);
		var nextMonth = new Date(theYear, theMonth + 1, 1);
		var len = Math.ceil((nextMonth.getTime() - 
			thisMonth.getTime())/oneDay);
		return len;
	},
	str_replace_delim : function(str,delim_ar,new_delim){
		if (str&&str.length){
			for (var i=0;i<delim_ar.length;i++){
				while (str.search(delim_ar[i])>=00){
					str = str.replace(delim_ar[i],new_delim);
				}
			}
		}
		return str;
	},
	
	/*
		Makes Date object from a user string
		Different possible user formats are supported:
		01/01/1999 01-01-00
	*/
	strToDate : function(date_str){
		var SHORT_YEAR_LEN=8;
		var FULL_YEAR_LEN=10;
		var time = new Array(0,0,0);
		var date = new Array(0,0,0);
		var time_part='',date_part='';
		var TIME_DELIM = ':';
		var DATE_DELIM = '.';
		var PARTS_DELIM = ' ';
		
		var date_str_copy = DateHandler.str_replace_delim(date_str,new Array(/T/),PARTS_DELIM);
		var separ = date_str_copy.indexOf(PARTS_DELIM);
		if (separ>=0){					
			time_part = date_str_copy.substr(separ+1);
			date_part = date_str_copy.slice(0,separ);
		}
		else{
			date_part = date_str_copy;
		}
		
		//if ((date_part.length!=SHORT_YEAR_LEN)&&(date_part.length!=FULL_YEAR_LEN)){
			//throw new Error('Undefind data format!');
		//}
		date_part = DateHandler.str_replace_delim(date_part,new Array(/\//,/-/,/:/),DATE_DELIM);
		time_part = DateHandler.str_replace_delim(time_part,new Array(/ /,/-/,/\//),TIME_DELIM);
		//alert('date='+date_part+' time='+time_part);
		if (date_part.length>0){
			date = date_part.split(DATE_DELIM);
		}
		if (time_part.length>0){
			time = time_part.split(TIME_DELIM);
		}
		if (date[2].length==2){
			date[2]=parseInt(date[2],10)+2000;
		}
		if (time[2]==undefined){
			time[2] = 0;
		}
		//alert(date[2]+''+date[1]+''+date[0]+' '+time[0]+''+time[1]+''+time[2]);
		date[1] = (date[1]==0)? 0:date[1]-1;
		return new Date(date[2],date[1],date[0],time[0],time[1],time[2]);
	},
/*
Converts given date-time string in SQL format to js Date object
*/
	dateObjFromSQL : function (date_str){
		var time = new Array(0,0,0);
		var date = new Array(0,0,0);
		var TIME_DELIM = ':';
		var DATE_DELIM = '.';
		var PARTS_DELIM = ' ';
		var str = DateHandler.str_replace_delim(date_str,new Array(/T/),PARTS_DELIM);
		var separ = str.indexOf(PARTS_DELIM);
		if (separ>=0){	
			time = str.substr(separ+1).split(TIME_DELIM);
			str = date_str.substr(0,separ);
		}
		str = DateHandler.str_replace_delim(str,new Array(/-/),DATE_DELIM);
		date = str.split(DATE_DELIM);
		return new Date(date[0],(date[1]==0)? 0:date[1]-1,date[2],time[0],time[1],time[2]);
	},
	weekStart : function(d) {
	   return new Date(d.getFullYear(),
		d.getMonth(), d.getDate()-(7 - d.getDay())
		);
	},	
	weekEnd : function(d) {
	   return new Date(d.getFullYear(),
		d.getMonth(), d.getDate()+(8 - d.getDay())
		);
	}		
}
