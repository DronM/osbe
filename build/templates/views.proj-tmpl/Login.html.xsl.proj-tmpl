<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:import href="ViewBase.html.xsl"/>

<!--
<div><input id="submit_register" class="formbutton" type="submit" value="Регистрация" name="submit_register"/></div>
-->

<xsl:template match="/">
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
		<xsl:apply-templates select="/document/model[@id='ModelVars']"/>
		<xsl:apply-templates select="/document/model[@id='ModelStyleSheet']/row"/>
		<link rel="icon" type="image/png" href="{$BASE_PATH}img/favicon.png"/>
		<script>
			var HOST_NAME = '<xsl:value-of select="/document/model[@id='ModelVars']/row/basePath"/>';
			
			function setError(errStr){
				var n = nd("errorReporter");
				n.innerHTML=errStr;
				DOMHandler.addClass(n,"alert alert-danger");
				
				DOMHandler.removeClass(nd("submit_login"),"disabled");
			}
			
			//<![CDATA[
			function pageLoad(){
				DOMHandler.removeClass(nd("submit_login"),"disabled");
				nd("submit_login").onclick = function(e){
					var er_ctrl = nd("errorReporter");
					DOMHandler.removeClass(er_ctrl,"alert alert-danger");
					er_ctrl.innerHTML = "";
				
					e = EventHandler.fixMouseEvent(e);
					DOMHandler.addClass(e.target,"disabled");
					
					var user = nd("Logger_user").value;
					var pwd = nd("Logger_pwd").value;

					if (!user&&!pwd){
						setError("Не задано имя пользователя и пароль!");
						return false;
					}
					else if (!user){
						setError("Не задано имя пользователя!");
						return false;
					}
					else if (!pwd){
						setError("Не задан пароль!");
						return false;
					}										
					
					var contr = new User_Controller(new ServConnector(HOST_NAME));
					contr.run("login",{
						params:{"name":user,"pwd":pwd},
						func:function(){
							document.location.href=HOST_NAME;
						},
						err:function(resp,errCode,errStr){
							setError(errStr);
						}
					});
					
					return false;
				}
			}
			//]]>
		</script>		
		<title>_________</title>
	</head>
	<body onload="pageLoad();">
		<xsl:apply-templates select="/document/model[@id='ModelServResponse']/row"/>		
		
		<div class="page-header">
		</div>		
		
		<form id="LoggerForm" name="obj_Logger_form"
		action="index.php"
		method="POST" enctype="multipart/form-data"
		class="form-horizontal">
			<h4 class="text-center">Вход в личный кабинет</h4>
			<div class="text-center" id="errorReporter"/>
			<div class="form-group">
				<label for="Logger_user" class="col-sm-4 control-label">Пользователь:</label>
				<div class="col-sm-4">
					<input type="text" class="form-control" id="Logger_user" placeholder="Введите имя пользователя" name="name"/>
				</div>
			</div>
			<div class="form-group">
				<label for="Logger_pwd" class="col-sm-4 control-label">Пароль:</label>
				<div class="col-sm-4">
					<input type="password" class="form-control" id="Logger_pwd" placeholder="Введите пароль" name="pwd"/>
				</div>
			</div>
			<div class="form-group">
				<div class="col-sm-offset-4 col-sm-4">			
				<input id="submit_login" class="btn btn-primary disabled" type="submit" value="Войти" name="submit_login"/>
				</div>
			</div>
		</form>		
		
		<!--waiting  -->
		<div id="waiting">
			<div>Ждите</div>
			<img src="{$BASE_PATH}img/loading.gif"/>
		</div>
		<script>
				var n = document.getElementById("Logger_user");
				if (n){
					if (document.activeElement.id!="Logger_pwd"){
						n.focus();
					}
				}
		</script>
		<!--ALL js modules -->
		<xsl:apply-templates select="/document/model[@id='ModelJavaScript']/row"/>
		<script>
			var dv = document.getElementById("waiting");
			if (dv!==null){
				dv.parentNode.removeChild(dv);
			}
		</script>
		 
	</body>
</html>		
</xsl:template>

</xsl:stylesheet>
