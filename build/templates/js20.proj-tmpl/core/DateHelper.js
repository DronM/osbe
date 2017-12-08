/* Copyright (c) 2016 
	Andrey Mikhalevich, Katren ltd.
*/
/*
	class	
	DateHelper
*/
/**
*/

var DateHelper = {	
	DEF_FORMAT:"Y-m-dTH:i:s",
	
	time : function(){
		return new Date();
	},
	
	/*From ISO string*/
	strtotime : function(dateStr){
		if (!dateStr || !dateStr.length)return;
		var ds = dateStr; 
		var t_offset_p = ds.indexOf("+");
		if (CommonHelper.isIE()){
			ds = ds.replace(/-/g, '/');
			ds = ds.replace('T', ' ');
			ds = ds.replace(/(\+[0-9]{2})(\:)([0-9]{2}$)/, ' UTC\$1\$3');
		}
		else if (ds.length>12 && t_offset_p==-1 && ds.substr(ds.length-1,1)!="Z"){
			//no time zone
			ds+="+05:00";//ToDo locale offset
		}
		else if (t_offset_p!=-1){
			//
			var t_offset_ar = ds.substr(t_offset_p+1).split(":");
			for (var i=t_offset_ar.length;i<2;i++){
				t_offset_ar.push("00");
			}
			ds = ds.substr(0,t_offset_p-1)+"+"+t_offset_ar.join(":");
		}
		var d = new Date(ds);
		//console.log("strtotime ds="+ds+" date="+d)
		return d;
	},
	/*
		Makes Date object from a user string
		Different possible user formats are supported:
		01/01/1999
		01/01/06 = 01/01/2006
		01-01-06 = 01/01/2006
		01-01-2016
		2016-01-01
		Time can be attached with space or T or nothing
		date 00:00:00
		dateT00:00:00
		date00:00:00
		Time can be separated with : or nothing
	*/
	userStrToDate : function(date_str){
		var SHORT_YEAR_LEN=8;
		var FULL_YEAR_LEN=10;
		var time = new Array(0,0,0);
		var date = new Array(0,0,0);
		var time_part='',date_part='';
		var TIME_DELIM = ':';
		var DATE_DELIM = '.';
		var PARTS_DELIM = ' ';
		
		var NEXT_MIL_BOUND = 40;// date with year<=40 and less will be interpreted as 2040, bigger as 1950
		
		var str_replace_delim = function(str,delim_ar,new_delim){
			if (str && str.length){
				for (var i=0;i<delim_ar.length;i++){
					while (str.search(delim_ar[i])>=00){
						str = str.replace(delim_ar[i],new_delim);
					}
				}
			}
			return str;
		};
		
		var date_str_copy = str_replace_delim(date_str,new Array(/T/),PARTS_DELIM);
		var separ = date_str_copy.indexOf(PARTS_DELIM);
		if (separ>=0){					
			date_part = date_str_copy.slice(0,separ);
			time_part = date_str_copy.substr(separ+1);			
		}
		else{
			//Which part is it?
			if (date_str_copy.indexOf(TIME_DELIM)==-1){
				date_part = date_str_copy;			
			}
			else{
				time_part = date_str_copy;			
			}
		}
		
		date_part = str_replace_delim(date_part,new Array(/\//,/-/,/:/),DATE_DELIM);
		time_part = str_replace_delim(time_part,new Array(/ /,/-/,/\//),TIME_DELIM);
		
		if (date_part.length>0){
			date = date_part.split(DATE_DELIM);
		}
		if (time_part.length>0){
			time = time_part.split(TIME_DELIM);
		}
		
		if (date.length && date[0].length==4){
			//year first swap
			var y = date[0];
			date[0] = date[2];
			date[2] = y;
		}
		else if (date.length>=3 && date[2].length==2){
			date[2] = parseInt(date[2],10);
			date[2] += (date[2]<=NEXT_MIL_BOUND)? 2000:1900;
		}
		if (time[2]==undefined){
			time[2] = 0;
		}
		date[1] = (date[1]==0)? 0:date[1]-1;
		return new Date(date[2],date[1],date[0],time[0],time[1],time[2]);
	},
	
	format:function(dt,fs){
		add_zero = function(arg){
			var s = arg.toString();
			return ((s.length<2)? "0":"")+s;
		};
		/*
		if (!dt){
			dt = this.time();
		}
		*/
		if (!dt || !dt.getDate){
			throw Error("DateHelper.format Invalid date "+dt);
		}
		
		if (!fs){
			fs = this.DEF_FORMAT;
		}
		var s;
		
		//for days
		s = fs.replace(/d/,add_zero(dt.getDate()));
		s = s.replace(/j/,dt.getDate());
		
		//for month
		s = s.replace(/F/,DateHelper.MON_LIST[dt.getMonth()]);
		s = s.replace(/m/,add_zero(dt.getMonth()+1));
		s = s.replace(/n/,dt.getMonth()+1);
		
		//for year
		s = s.replace(/Y/,dt.getFullYear());
		s = s.replace(/y/,dt.getFullYear()-2000);
		
		//hour
		s = s.replace(/H/,add_zero(dt.getHours()));					
		//minutes
		s = s.replace(/i/,add_zero(dt.getMinutes()));
		//sec
		s = s.replace(/s/,add_zero(dt.getSeconds()));
		//msec
		s = s.replace(/u/,add_zero(dt.getMilliseconds()));
		
		return s;
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
			h = ( isNaN(h)? 0:h);
		}		
		
		if (time_ar.length>=2){
			m = parseInt(time_ar[1][0],10)*10+
				parseInt(time_ar[1][1],10);
			m = ( isNaN(m)? 0:m);
		}		
		if (time_ar.length>=3){
			s = parseInt(time_ar[2][0],10)*10+
				parseInt(time_ar[2][1],10);
			s = ( isNaN(s)? 0:s);
		}
		return (h*60*60*1000 + m*60*1000 + s*1000);
	},

	weekStart : function(dt) {
		if(!dt)dt = this.time();
		var dow = dt.getDay();
		var dif = dow - 1;	
		if (dif<0)dif = 6;		
		return new Date(dt.getTime()-dif*24*60*60*1000);
	},	
	
	weekEnd : function(dt) {
		return new Date(this.weekStart(dt).getTime() + 6*24*60*60*1000);
	},
	
	monthStart : function(dt) {
		if(!dt)dt = this.time();
		return new Date(dt.getFullYear(), dt.getMonth(), 1);
	},	
	monthEnd : function(dt) {
		if(!dt)dt = this.time();
		return new Date(dt.getFullYear(), dt.getMonth()+1, 0);
	},
	
	quarterStart : function(dt){
		if(!dt)dt = this.time();
		var m = dt.getMonth();
		if (m==1 || m==2){
			m = 0;
		}
		else if (m==4 || m==5){
			m = 3;
		}
		else if (m==7 || m==8){
			m = 6;
		}
		else if (m==10 || m==11){
			m = 9;
		};
		return new Date(dt.getFullYear(),m,1);
	},	
	quarterEnd : function(dt){
		if(!dt)dt = this.time();
		var m = dt.getMonth();
		if (m==0 || m==1){
			m = 2;
		}
		else if (m==3 || m==4){
			m = 5;
		}
		else if (m==6 || m==7){
			m = 8;
		}
		else if (m==9 || m==10){
			m = 11;
		};
		return this.monthEnd(new Date(dt.getFullYear(),m,1));
	},
	
	yearStart : function(dt) {
		if(!dt)dt = this.time();
		return new Date(dt.getFullYear(), 0, 1);
	},	
	yearEnd : function(dt) {
		if(!dt)dt = this.time();
		return new Date(dt.getFullYear(), 12, 0);
	},
	
	// https://github.com/lsmith/addBusinessDays/blob/master/addBusinessDays.js
	// var d = new Date();
	// addBusinessDays(d, numberOfDays);

	addBusinessDays : function(d,n) {
	    d = new Date(d.getTime());
	    var day = d.getDay();
	    d.setDate(d.getDate() + n + (day === 6 ? 2 : +!day) + (Math.floor((n - 1 + (day % 6 || 1)) / 5) * 2));
	    return d;
	}	
		
}
