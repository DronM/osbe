/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends
 * @requires core/extend.js  

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {namespace} options
 * @param {string} options.className
 * @param {Bool} [options.cmdAdd=true]
 * @param {Control} [options.fileAddControl=ButtonCmd]
 * @param {Button} [options.fileAddButton=ButtonCmd]
 * @param {Bool} [options.cmdPause=true]
 * @param {Control} [options.filePauseControl=ButtonCmd]
 * @param {Control} [options.filePauseButton=ButtonCmd] 
 * @param {Bool} [options.cmdUpload=true] 
 * @param {Control} [options.fileUploadControl=ButtonCmd]
 * @param {Control} [options.fileUploadButton=ButtonCmd]   
 * @param {Bool} [options.cmdCancel=true] 
 * @param {Control} [options.fileCancelControl=ButtonCmd]
 * @param {Control} [options.fileCancelButton=ButtonCmd]    
 */
function BigFileUploader(id,options){
	options = options || {};	
	
	/*
	options.elements = [
		new ButtonCmd(id+":file-add",{
				"caption":"Загрузить",
				"onClick":function(){
					alert("!!!")
				}
			})	
	];
	*/
	BigFileUploader.superclass.constructor.call(this,id,"template",options);
	
	var self = this;
	
	options.cmdAdd = (options.cmdAdd!=undefined)? options.cmdAdd:true;
	options.cmdPause = (options.cmdPause!=undefined)? options.cmdPause:true;
	options.cmdUpload = (options.cmdUpload!=undefined)? options.cmdUpload:true;
	options.cmdCancel = (options.cmdCancel!=undefined)? options.cmdCancel:true;

	this.addElement(new ControlContainer(id+":file-list","div",{
		"elements":[
			new Control(id+":file-list:header","h1",{"value":this.DRAG_AREA_TITLE}),
			new ControlContainer(id+":file-list:list","ul",{})
		]
	}));
	
	if (options.cmdAdd){
		this.addElement(options.fileAddControl || new ((options.fileAddButton)? options.fileAddButton:ButtonCmd)(id+":file-add",{
			"glyph":this.GLYPH_ADD,
			"title":this.FILE_ADD_TITLE
		}));
	}
		
	if (options.cmdUpload){
		this.addElement(options.fileUploadControl || new ((options.fileUploadButton)? options.fileUploadButton:ButtonCmd)(id+":file-upload",{
			"glyph":this.GLYPH_UPLOAD,
			"title":this.FILE_ULOAD_TITLE,
			"onClick":function(){
				self.fileUpload();
			}
		}));
	}
	
	if (options.cmdPause){
		this.addElement(options.filePauseControl || new ((options.filePauseButton)? options.filePauseButton:ButtonCmd)(id+":file-pause",{
			"glyph":this.GLYPH_PAUSE,
			"title":this.FILE_PAUSE_PAUSE_TITLE,
			"enabled":false,
			"onClick":function(){
				self.filePause();
			}
		}));
	}

	if (options.cmdCancel){
		this.addElement(options.fileCancelControl || new ((options.fileCancelButton)? options.fileCancelButton:ButtonCmd)(id+":file-cancel",{
			"glyph":this.GLYPH_CANCEL,
			"title":this.FILE_CANCEL_TITLE,
			"onClick":function(){
				self.fileCancel();
			}
		}));
	}
		
	this.m_resumable = new Resumable({
		"target": options.target || "functions/upload.php",
		"testChunks": true,		
		"fileType":[],
		"maxFilesErrorCallback":function(files, errorCount){
			var maxFiles = $.getOpt('maxFiles');
			window.showError(CommonHelper.format(this.ER_MAX_FILES,Array(maxFiles)));
		},
		"minFileSizeErrorCallback":function(file, errorCount){
			var f_name = file.fileName||file.name;
			var sz = $h.formatSize($.getOpt('minFileSize'));
			window.showError(CommonHelper.format(this.ER_MIN_FILE_SIZE,Array(f_name,sz)));
		},
		"maxFileSizeErrorCallback":function(file, errorCount){
			var f_name = file.fileName||file.name;
			var sz = $h.formatSize($.getOpt('maxFileSize'));
			window.showError(CommonHelper.format(this.ER_MAX_FILE_SIZE,Array(f_name,sz)));
		},
		"fileTypeErrorCallback":function(file, errorCount){
			var f_name = file.fileName||file.name;
			CommonHelper.format(this.ER_FILE_TYPE,Array(f_name,$.getOpt('fileType')));
		},
		"query":function(file,chunk){
			return self.m_queryParams;
		}
	});
 	
 	if (options.cmdAdd){
	 	this.m_resumable.assignBrowse(this.getElement("file-add").getNode());
	}	 	
 	this.m_resumable.assignDrop(this.getElement("file-list").getNode());
 	
 	if (!this.m_resumable.support){
 		window.showWarn("Big file upload not supported!");
 	}
 	
 	this.m_progressBarNode = $("#upload-progress");
 	
	this.m_resumable.on("fileAdded", function(file, event){
		var l = self.getElement("file-list").getElement("list");
		var f_elem = new ControlContainer(self.getId()+":file-list:list:"+file.file.name,"li",{
			elements:[
				new Control(CommonHelper.uniqid(),"img",{
					"className":"hide file-upload-mark",
					"src":"img/wait-sm.gif"
				}),
				new Control(CommonHelper.uniqid(),"i",{
					"className":"glyphicon glyphicon-remove",
					"events":{
						"click":function(e){
							if (!self.m_resumable.isUploading()) {								
								var list = self.getElement("file-list").getElement("list");
								list.delElement(file.file.name);
								if (!list.getCount()){
									self.progressFinish();	
								}
								self.m_resumable.removeFile(file);
							}
						}					
					}
				}),
				new Control(CommonHelper.uniqid(),"span",{"value":file.file.name+" ("+CommonHelper.byteForamt(file.file.size)+")"})
			]
			//
		});		
		l.addElement(f_elem);
		l.toDOM();
		self.progressFileAdded();
	}); 	
	this.m_resumable.on("fileSuccess", function(file,message){
		//mark file finished
		//mark file
		var imgs = DOMHelper.getElementsByAttr("file-upload-mark",self.m_node,"class",false,"img");
		for (var i in imgs){
			imgs[i].src = "img/ok.png";
			DOMHelper.delClass(imgs[i],"hide");
		}
		
		self.progressFinish();
		self.m_onFinish();
	});
	this.m_resumable.on("cancel", function(){
		self.progressFinish();
	});	
	this.m_resumable.on("uploadStart", function(){
		var b = self.getElement("file-pause");
		if (b){
			b.setEnabled(true);
		}
		
		//mark file
		var imgs = DOMHelper.getElementsByAttr("file-upload-mark",self.m_node,"class",false,"img");
		for (var i in imgs){
			imgs[i].src = "img/wait-sm.gif";
			DOMHelper.delClass(imgs[i],"hide");
		}
		
		self.m_paused = false;
	});		
	this.m_resumable.on("error", function(message,file){
		self.progressFinish();
		window.showError("Error:onerror "+message);
	});
	 
	this.m_resumable.on("progress", function(){		
		if (self.m_paused){
			var btn = self.getElement("file-pause");
			if (btn){
				btn.setGlyph(self.GLYPH_PAUSE);
				btn.setAttr("title",self.FILE_PAUSE_PAUSE_TITLE);
			}
			self.m_paused = false;
		}
		
		self.progressUploading(self.m_resumable.progress()*100);
	});

	this.m_resumable.on("pause", function(){
		//$("#pause-upload-btn").find(".glyphicon").removeClass("glyphicon-pause").addClass("glyphicon-play");
		self.m_paused = true;
		var btn = self.getElement("file-pause");
		if (btn){
			btn.setGlyph(self.GLYPH_PLAY);
			btn.setAttr("title",self.FILE_PAUSE_PLAY_TITLE);
		}
	});
	
	this.m_queryParams = options.queryParams || {};
	this.m_onFinish = options.onFinish;
}
extend(BigFileUploader,ControlContainer);

/* Constants */
BigFileUploader.prototype.GLYPH_UPLOAD = "glyphicon-upload";
BigFileUploader.prototype.GLYPH_PLAY = "glyphicon-play";
BigFileUploader.prototype.GLYPH_PAUSE = "glyphicon-pause";
BigFileUploader.prototype.GLYPH_ADD = "glyphicon-plus";
BigFileUploader.prototype.GLYPH_CANCEL = "glyphicon-remove";

/* private members */
BigFileUploader.prototype.m_resumable;
BigFileUploader.prototype.m_progressBarNode;
BigFileUploader.prototype.m_queryParams;

/* protected*/


/* public methods */
BigFileUploader.prototype.fileUpload = function(){
	this.m_resumable.upload();
}

BigFileUploader.prototype.fileCancel = function(){
	//remove from list
	this.m_resumable.cancel();
	var l = this.getElement("file-list").getElement("list");
	l.clear();
}

BigFileUploader.prototype.filePause = function(){
        if (this.m_resumable.files.length>0) {
            if (this.m_resumable.isUploading()) {
            	return  this.m_resumable.pause();
            }
            return this.m_resumable.upload();
        }
 }
BigFileUploader.prototype.progressFileAdded = function() {
	this.m_progressBarNode.removeClass("hide").find(".progress-bar").css("width","0%");
}

BigFileUploader.prototype.progressUploading = function(progress) {
	var el = this.m_progressBarNode.find(".progress-bar");
	el.attr("style", "width:"+progress+"%");
	el.attr("aria-valuenow", progress);
	el.val(progress+"%");
}

BigFileUploader.prototype.progressFinish = function() {
	this.m_progressBarNode.addClass("hide").find(".progress-bar").css("width","0%");
	
	var b = this.getElement("file-pause");
	if (b){
		b.setEnabled(false);
	}
}

BigFileUploader.prototype.setQueryParam = function(id,v) {
	this.m_queryParams[id] = v;
}
