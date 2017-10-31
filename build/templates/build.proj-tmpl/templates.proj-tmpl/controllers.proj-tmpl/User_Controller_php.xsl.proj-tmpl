<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:import href="Controller_php.xsl"/>

<!-- -->
<xsl:variable name="CONTROLLER_ID" select="'User'"/>
<!-- -->

<xsl:output method="text" indent="yes"
			doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" 
			doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>
			
<xsl:template match="/">
	<xsl:apply-templates select="metadata/controllers/controller[@id=$CONTROLLER_ID]"/>
</xsl:template>

<xsl:template match="controller"><![CDATA[<?php]]>
<xsl:call-template name="add_requirements"/>
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLString.php');
require_once(FRAME_WORK_PATH.'basic_classes/GlobalFilter.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelWhereSQL.php');
class <xsl:value-of select="@id"/>_Controller extends ControllerSQL{
	public function __construct($dbLinkMaster=NULL){
		parent::__construct($dbLinkMaster);<xsl:apply-templates/>
	}
	
	public function insert(){
		$pm = $this->getPublicMethod(ControllerDb::METH_INSERT);
		$pm->setParamValue('pwd',DEF_USER_PWD);
		parent::insert();
	}
	
	<xsl:call-template name="extra_methods"/>
}
<![CDATA[?>]]>
</xsl:template>

<xsl:template name="extra_methods">
	
	private function setLogged($logged){
		if ($logged){			
			$_SESSION['LOGGED'] = true;			
		}
		else{
			session_destroy();
			$_SESSION = array();
		}		
	}
	private function getLogged(){
		return (isset($_SESSION["LOGGED"]) AND $_SESSION["LOGGED"]);
	}
	public function logout(){
		$this->setLogged(FALSE);
	}
	public function logout_html(){
		$this->logout();
		header("Location: index.php");
	}
	
	public function do_login($pm){
		$link = $this->getDbLink();
		
		$name = NULL;
		$pwd = NULL;
		
		FieldSQLString::formatForDb($link,
			$pm->getParamValue('name'),$name);
		FieldSQLString::formatForDb($link,
			$pm->getParamValue('pwd'),$pwd);

		
		$ar = $link->query_first(
			sprintf(
			"SELECT 1 As res, u.role_id,u.id,
			get_role_types_descr(u.role_id) AS role_descr
			FROM users AS u
			WHERE u.name=%s AND u.pwd=md5(%s)",
			$name,$pwd));
		if ($ar){
			$this->setLogged(TRUE);
			$this->getDbLinkMaster()->query(
				sprintf("UPDATE logins SET 
					user_id = '%s'
				WHERE session_id='%s' AND user_id IS NULL",
				$ar['id'], session_id())
			);				
			
			$_SESSION['user_id'] = $ar['id'];
			$_SESSION['user_name'] = $pm->getParamValue('name');
			$_SESSION['user_pwd'] = $pm->getParamValue('pwd');
			$_SESSION['role_id'] = $ar['role_id'];
			$_SESSION['role_descr'] = $ar['role_descr'];
			
			//global filters
			$ar = $link->query_first(
				sprintf("SELECT id FROM logins
				WHERE session_id='%s'",session_id()));
			if (is_array($ar)){
				$_SESSION['LOGIN_ID'] = $ar['id'];
			}			
			
		}
		else{
			throw new Exception('Не верное имя пользователя или пароль.');
		}
	}
	public function logged(){
		if (!$this->getLogged()){
			throw new Exception('not logged');
		}
	}
	public function login($pm){
		$this->do_login($pm);
	}
	public function login_html($pm){
		//returns index if logged
		$this->do_login($pm);
		header("Location: index.php");
	}
	public function set_new_pwd(){
		$link = $this->getDbLink();
		$pwd = NULL;
		FieldSQLString::formatForDb($link,
			$this->getPublicMethod('set_new_pwd')->getParamValue('pwd'),
			$pwd);
	
		$this->getDbLinkMaster()->query(sprintf(
			"UPDATE users SET pwd=md5(%s)
			WHERE id=%d",
			$pwd,$_SESSION['user_id'])
		);
	}
</xsl:template>

</xsl:stylesheet>