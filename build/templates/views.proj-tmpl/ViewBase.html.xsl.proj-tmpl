<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:import href="index.html.xsl"/>
			
<xsl:template match="/">
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
		<xsl:apply-templates select="/document/model[@id='ModelVars']"/>
		<xsl:apply-templates select="/document/model[@id='ModelStyleSheet']/row"/>
		<link rel="icon" type="image/png" href="{$BASE_PATH}img/favicon.png"/>
		<title>Полимерпласт</title>
		<script>
			var HOST_NAME = '<xsl:value-of select="/document/model[@id='ModelVars']/row/basePath"/>';
			var MainView;//current opened view
			var onViewClose;//			
			var WIN_CLASS;
			var BS_COL;
			var CONSTANTS;			
			var CONSTANT_VALS;
			var SERV_VARS={
				"VERSION":'<xsl:value-of select="/document/model[@id='ModelVars']/row/scriptId"/>',
				"ROLE_ID":'<xsl:value-of select="/document/model[@id='ModelVars']/row/role_id"/>',
				"ROLE_DESCR":'<xsl:value-of select="/document/model[@id='ModelVars']/row/role_descr"/>',
				"USER_ID":'<xsl:value-of select="/document/model[@id='ModelVars']/row/user_id"/>',
				"USER_NAME":'<xsl:value-of select="/document/model[@id='ModelVars']/row/user_name"/>'
				};
			var CONST_CONTROLS ={};
			
			function pageLoad(){
				
				window.onerror = function(msg,url,line,col,error) {
					   var extra = !col ? "" : "\ncolumn: " + col;
					   extra += !error ? "" : "\nerror: " + error;
					   console.log("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);
					   console.trace();
					   WindowMessage.show({
						"type":WindowMessage.TP_ER,
						"text":msg+extra
						});
					   return false;
				};
				
				BS_COL = ("col-"+$('#users-device-size').find('div:visible').first().attr('id')+"-");
				
				WIN_CLASS = WindowFormDD;//ChildForm;
				CONSTANTS = new Constant_Controller(new ServConnector(HOST_NAME));
				CONSTANT_VALS = {
					"new_client_check_sec":null
					};
				CONSTANTS.readValues(CONSTANT_VALS);
				
				var self = this;
				onViewClose = function(res){					
					if (MainView!=undefined){
						MainView.removeDOM();
						delete MainView;
					}
				};
				
			<xsl:apply-templates select="/document/model[@id='MainMenu_Model']"/>
			<!--
			<xsl:if test="/document/model[@id='MainMenu_Model']/item[@default='TRUE']">
			onItemClick(<xsl:value-of select="/document/model[@id='MainMenu_Model']/item[@default='TRUE']/@viewId"/>);
			</xsl:if>
			-->
			if (SERV_VARS.ROLE_ID=="sales_manager"){
				//debugger;
				NEW_CLIENT_CHECK = new UnregClientCheck(CONSTANT_VALS.new_client_check_sec);
				
			}
					
			}
		</script>
	</head>
	<body onload="pageLoad();" class="layout_2_1 blue3">
		<div class="page-header">
			<img id="logo" src="{$BASE_PATH}img/logo.png"/>
		</div>		
		<ul id="mainMenu" class="nav nav-tabs">		
		</ul>
		<div id="content" class="panel-group">
		</div>
		<div id="footer">
		</div>
		<!-- bootstrap resolution-->
		<div id="users-device-size">
		  <div id="xs" class="visible-xs"></div>
		  <div id="sm" class="visible-sm"></div>
		  <div id="md" class="visible-md"></div>
		  <div id="lg" class="visible-lg"></div>
		</div>
		<!--waiting  -->
		<div id="waiting">
			<div>Ждите</div>
			<img src="{$BASE_PATH}img/loading.gif"/>
		</div>
		
		<!--ALL js modules -->
		<xsl:apply-templates select="/document/model[@id='ModelJavaScript']/row"/>
		<script>
			var dv = document.getElementById("waiting");
			if (dv!==null){
				//dv.parentNode.removeChild(dv);
				DOMHandler.addClass(dv,"invisible");
			}
		</script>
	
	</body>
</html>		
</xsl:template>

<xsl:template match="model[@id='MainMenu_Model']">	
	var onItemClick = function(viewClassId){		
		onViewClose();
		MainView = new viewClassId("MainView",
		{"onClose":onViewClose,
		"connect":new ServConnector(HOST_NAME)
		});	
		MainView.toDOM(nd("content"));
	};
<xsl:apply-templates select="item"/>
var item = new TabMenuItem('it_exit',{
	caption:"Выход",
	onClick:function(){
		window.location="<xsl:value-of select="$BASE_PATH"/>index.php?c=User_Controller&amp;f=logout&amp;v=Login";
	}
});
item.toDOM(nd("mainMenu"));

</xsl:template>

<xsl:template match="model[@id='MainMenu_Model']/item">
var opts={"caption":"<xsl:value-of select="@descr"/>",
	"viewClassId":<xsl:value-of select="@viewId"/>,
	<xsl:if test="@default='TRUE'">
	"defItem":true,
	</xsl:if>
	"onClick":onItemClick,
	"onClickContext":this};
var item = new TabMenuItem('it'+<xsl:value-of select="position()"/>,opts);
item.toDOM(nd("mainMenu"));
</xsl:template>


</xsl:stylesheet>
