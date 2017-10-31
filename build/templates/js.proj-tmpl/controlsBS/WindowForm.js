/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires common/functions.js
*/

//_blank - URL is loaded into a new WindowForm. This is default
//_parent - URL is loaded into the parent frame
//_self - URL replaces the current page
//_top URL replaces any framesets that may be loaded

/* constructor */
function WindowForm(options){
	options = options || {};
	if (options.id){
		this.m_id = options.id;
	}	
	options.height = options.height || this.DEF_HEIGHT;
	options.width = options.width || this.DEF_WIDTH;
	this.setDirectories(options.directories || this.DEF_DIRECTORIES);
	this.setChannelMode(options.channelMode || this.DEF_CHANNEL_MODE);
	this.setFullScreen(options.fullScreen || this.DEF_FULL_SCREEN);
	this.setHeight(options.height);
	if (options.center){
		this.m_center = true;
		this.setCenter(options.height||this.DEF_HEIGHT,
			options.width||this.DEF_WIDTH);
	}
	else{
		if (options.centerLeft){
			this.setLeftCenter(options.width||this.DEF_WIDTH);	
		}
		else{
			this.setLeft(options.left || this.DEF_LEFT);
		}
		if (options.centerTop){
			this.setTopCenter(options.height||this.DEF_HEIGHT);	
		}		
		else{
			this.setTop(options.top || this.DEF_TOP);		
		}
	}
	this.setLocation(options.location || this.DEF_LOCATION);
	this.setMenuBar(options.menuBar || this.DEF_MENU_BAR);
	this.setResizable(options.resizable || this.DEF_RESIZABLE);
	this.setScrollBars(options.scrollBars || this.DEF_SCROLL_BARS);
	this.setStatus(options.status || this.DEF_STATUS);
	this.setTitleBar(options.titleBar || this.DEF_TITLE_BAR);	
	this.setWidth(options.width);
//
	this.setName(options.name || this.DEF_WIN_NAME);
	
	if (options.host){
		this.setHost(options.host);
		this.setScript(options.script || this.DEF_SCRIPT);
		this.setURLParams(options.URLParams);
	}
	
	this.setCaption(options.caption||options.title||"");
	
	this.m_content = options.content;
	
	if (options.onBeforeClose){
		this.setOnBeforeClose(options.onBeforeClose);
	}
	
	//this.m_onCancel = options.onCancel;
	this.m_view = options.view;
	//this.m_winObj = options.winObj;
}

/* constants */
WindowForm.prototype.DEF_DIRECTORIES = "0";
WindowForm.prototype.DEF_CHANNEL_MODE = "0";
WindowForm.prototype.DEF_FULL_SCREEN = 0;
WindowForm.prototype.DEF_HEIGHT = "500";
WindowForm.prototype.DEF_LEFT = "0";
WindowForm.prototype.DEF_LOCATION = "0";
WindowForm.prototype.DEF_MENU_BAR = 0;
WindowForm.prototype.DEF_RESIZABLE = "1";
WindowForm.prototype.DEF_SCROLL_BARS = "1";
WindowForm.prototype.DEF_STATUS = "0";
WindowForm.prototype.DEF_TITLE_BAR = "0";
WindowForm.prototype.DEF_TOP = "0";
WindowForm.prototype.DEF_WIDTH = "600";
WindowForm.prototype.DEF_WIN_NAME = "_blank";
WindowForm.prototype.DEF_SCRIPT = "index.php";
WindowForm.prototype.DEF_CENTER_TOP_OFFSET = "20";
//
WindowForm.prototype.m_directories;
WindowForm.prototype.m_channelMode;
WindowForm.prototype.m_fullScreen;
WindowForm.prototype.m_height;
WindowForm.prototype.m_left;
WindowForm.prototype.m_location;
WindowForm.prototype.m_menuBar;
WindowForm.prototype.m_resizable;
WindowForm.prototype.m_scrollBars;
WindowForm.prototype.m_status;
WindowForm.prototype.m_titleBar;
WindowForm.prototype.m_top;
WindowForm.prototype.m_width;
//
WindowForm.prototype.m_name;
WindowForm.prototype.m_host;
WindowForm.prototype.m_script;
WindowForm.prototype.m_URLParams;
WindowForm.prototype.m_WindowForm;
/* private members */

/* public methods */
WindowForm.prototype.open = function(){
	var win_opts = 
		"directories="+this.m_directories+","+
		"channelMode="+this.m_channelMode+","+
		"fullScreen="+this.m_fullScreen+","+
		"height="+this.m_height+","+
		"left="+this.m_left+","+
		"location="+this.m_location+","+
		"menubar="+this.m_menuBar+","+
		"resizable="+this.m_resizable+","+
		"scrollbars="+this.m_scrollBars+","+
		"status="+this.m_status+","+
		"titlebar="+this.m_titleBar+","+
		"top="+this.m_top+","+
		"width="+this.m_width;
	var url = '';
	if (this.m_host){
		url = this.getURL();
	}
	this.m_WindowForm = window.open(url,this.m_name,win_opts);
	if (url==''&&this.m_content){
		this.m_WindowForm.document.write(this.m_content);
	}
	return this.m_WindowForm;
}
WindowForm.prototype.close = function(){
	if (this.m_WindowForm){
		this.m_WindowForm.close();
	}
}

WindowForm.prototype.setDirectories = function(directories){
	this.m_directories = directories;
}
WindowForm.prototype.setChannelMode = function(channelMode){
	this.m_channelMode = channelMode;
}
WindowForm.prototype.setFullScreen = function(fullScreen){
	this.m_fullScreen = fullScreen;
}
WindowForm.prototype.setHeight = function(height){
	if (height){
		this.m_height = height;
	}
}
WindowForm.prototype.setLeft = function(left){
	this.m_left = left;
}
WindowForm.prototype.setLocation = function(location){
	this.m_location = location;
}
WindowForm.prototype.setMenuBar = function(menuBar){
	this.m_menuBar = menuBar;
}
WindowForm.prototype.setResizable = function(resizable){
	this.m_resizable = resizable;
}
WindowForm.prototype.setScrollBars = function(scrollBars){
	this.m_scrollBars = scrollBars;
}
WindowForm.prototype.setStatus = function(status){
	this.m_status = status;
}
WindowForm.prototype.setTitleBar = function(titleBar){
	this.m_titleBar = titleBar;
}
WindowForm.prototype.setTop = function(top){
	if (top){
		this.m_top = top;
	}
}
WindowForm.prototype.setWidth = function(width){
	if (width){
		this.m_width = width;
	}
}
WindowForm.prototype.setSize = function(w,h){
	this.m_w = width;
	this.m_h = h;
}

//
WindowForm.prototype.setName = function(name){
	this.m_name = name;
}
WindowForm.prototype.getScript = function(){
	return this.m_script;
}
WindowForm.prototype.setScript = function(script){
	this.m_script = script;
}
WindowForm.prototype.getHost = function(){
	var host = this.m_host;
	if (host&&host.length
	&&host.substring(host.length-1,host.length)!="/"){
		host+="/";
	}
	return host;
}
WindowForm.prototype.setHost = function(host){
	this.m_host = host;
}
WindowForm.prototype.getURL = function(){
	var h = this.getHost();
	if (!h){
		return;
	}
	var s = this.getScript();
	if (!s){
		return;
	}	
	var p = this.getURLParams();
	if (p){
		p = "?"+p;
	}
	else{
		p = "";
	}
	return (h+s+p);
}
WindowForm.prototype.setURLParams = function(URLParams){
	this.m_URLParams = URLParams;
}
WindowForm.prototype.getURLParams = function(){
	return this.m_URLParams;
}
WindowForm.prototype.setLeftCenter = function(width){
	var l = Math.floor(getViewportWidth()/2) - Math.floor(width/2);
	this.setLeft(l);
}
WindowForm.prototype.setTopCenter = function(height){
	var t = Math.floor(getViewportHeight()/2) - Math.floor(height/2);
	this.setTop(t+this.DEF_CENTER_TOP_OFFSET);
}
WindowForm.prototype.setCenter = function(height,width){
	this.setLeftCenter(width);
	this.setTopCenter(height);
}

WindowForm.prototype.getWindowForm = function(){
	return this.m_WindowForm;
}
WindowForm.prototype.getContentParent = function(){
	return this.m_WindowForm.document.body;
}
WindowForm.prototype.setFocus = function(){
	return this.m_WindowForm.focus();
}
WindowForm.prototype.setTitle = function(title){
	this.m_title=title;
}
WindowForm.prototype.setCaption = function(caption){
	this.setTitle(caption);
}
WindowForm.prototype.setOnBeforeClose = function(f){
	this.m_onBeforeClose = f;
}
