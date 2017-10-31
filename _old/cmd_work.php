<?php
require_once('Config.php');
require_once(FRAME_WORK_PATH.'Constants.php');
require_once(FRAME_WORK_PATH.'db/SessionManager.php');
require_once(FRAME_WORK_PATH.'db/db_pgsql.php');

require_once(FRAME_WORK_PATH.'basic_classes/Controller.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelServResponse.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLString.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtString.php');

try{
	//master connection for writing
	$dbLinkMaster = new DB_Sql();
	$dbLinkMaster->persistent=true;
	$dbLinkMaster->appname = APP_NAME;
	$dbLinkMaster->technicalemail = TECH_EMAIL;
	$dbLinkMaster->reporterror = DEBUG;
	$dbLinkMaster->database	= DB_NAME;			
	$port = (defined('DB_PORT_MASTER'))? DB_PORT:NULL;
	$dbLinkMaster->connect(DB_SERVER_MASTER,DB_USER,DB_PASSWORD,$port);
	//$dbLinkMaster->set_error_verbosity((DEBUG)? PGSQL_ERRORS_VERBOSE:PGSQL_ERRORS_TERSE);
	if (DB_SERVER_MASTER==DB_SERVER){
		$dbLink = $dbLinkMaster;
	}
	else{
		// connection for reading
		$dbLink = new DB_Sql();
		$dbLink->persistent=true;
		$dbLink->appname = APP_NAME;
		$dbLink->technicalemail = TECH_EMAIL;
		$dbLink->reporterror = DEBUG;
		$dbLink->database= DB_NAME;			
		$port = (defined('DB_PORT'))? DB_PORT:NULL;
		$dbLink->connect(DB_SERVER,DB_USER,DB_PASSWORD,$port);		
	}
	//**********АВТОРИЗАЦИЯ ПО ТОКЕН**********	
	/*
	if (defined('AJAX_EXT_VIEW')
	&&isset($_REQUEST[PARAM_VIEW])
	&&$_REQUEST[PARAM_VIEW]==AJAX_EXT_VIEW
	&&isset($_REQUEST[PARAM_METHOD])
	&&($_REQUEST[PARAM_METHOD]!='login_ext'
		&&$_REQUEST[PARAM_METHOD]!='login'
		&&$_REQUEST[PARAM_METHOD]!='login_k'
	)
	)
	*/
	if (isset($_REQUEST['token'])){	
		/*
		if (!isset($_REQUEST['token'])){
			throw new Exception(ERR_AUTH);
		}
		*/
		$access_p = strpos($_REQUEST['token'],':');
		if ($access_p===FALSE){
			throw new Exception(ERR_AUTH);
		}
		$access_salt = substr($_REQUEST['token'],0,$access_p);
		$access_hash = substr($_REQUEST['token'],$access_p+1);
		
		$access_salt_db = NULL;
		$f = new FieldExtString('salt');
		FieldSQLString::formatForDb($dbLink,$f->validate($access_salt),$access_salt_db);
		
		$session_ar = $dbLink->query_first(
		"SELECT
			trim(l.session_id) session_id,
			(EXTRACT(EPOCH FROM now()::timestamp-l.set_date_time)>=".SESSION_EXP_SEC."
			) AS expired
		FROM logins l
		WHERE l.date_time_out IS NULL
			AND l.pub_key=".$access_salt_db);
		if (!$session_ar['session_id']
		||$access_hash!=md5($access_salt.$session_ar['session_id'])
		){
			throw new Exception(ERR_AUTH);
		}	

		session_id($session_ar['session_id']);

	}
	
	//*************************
	
	$session = new SessionManager();
	$session->start_session('_s', $dbLinkMaster,$dbLink);

	if (isset($_REQUEST['token'])
	&& $session_ar['expired']=='t'
	&& $_REQUEST[PARAM_METHOD]!='login_refresh'
	&& $_REQUEST[PARAM_METHOD]!='logout'
	&& $_REQUEST[PARAM_METHOD]!='logout_html'){		
		session_destroy();
		$_SESSION = array();		
		throw new Exception(ERR_AUTH_EXP);
	}		
		
	//setting locale
	if (isset($_SESSION['user_time_locale'])){			
		$q = sprintf("SET TIME ZONE '%s'",
			$_SESSION['user_time_locale']
		);
		$dbLink->query($q);
		if (DB_SERVER_MASTER!=DB_SERVER){
			$dbLinkMaster->query($q);
		}
		
		//php locale		
		date_default_timezone_set($_SESSION['user_time_locale']);
	}
		
	if (!isset($_SESSION['scriptId'])){
		$_SESSION['scriptId'] = md5(session_id());
	}
	
	//*****************************
//default page params

	if (!isset($_SESSION['LOGGED'])){			
		if (!isset($_REQUEST[PARAM_CONTROLLER])){
			$_REQUEST[PARAM_CONTROLLER] = 'User_Controller';
		}
		if (!isset($_REQUEST[PARAM_VIEW])){
			$_REQUEST[PARAM_VIEW] = 'Login';
		}
		if ($_REQUEST[PARAM_VIEW] == 'Login'
		&& (isset($_REQUEST[PARAM_METHOD]) && $_REQUEST[PARAM_METHOD]!='login' && $_REQUEST[PARAM_METHOD]!='login_html')
		){
			$_REQUEST[PARAM_METHOD]='login';
		}	
	}
	
	$contr = (isset($_REQUEST[PARAM_CONTROLLER]))? $_REQUEST[PARAM_CONTROLLER]:null;
	$meth = (isset($_REQUEST[PARAM_METHOD]))? $_REQUEST[PARAM_METHOD]:null;	
	$view = (isset($_REQUEST[PARAM_VIEW]))? $_REQUEST[PARAM_VIEW]:DEF_VIEW;
	/* controller checking*/
	
	if (isset($contr) && !file_exists($script=USER_CONTROLLERS_PATH.$contr.'.php')){	
		if (!isset($_SESSION['LOGGED'])){
			throw new Exception(ERR_AUTH_NOT_LOGGED);
		}
		else{		
			throw new Exception(ERR_COM_NO_CONTROLLER);
		}
	}
	else if (!isset($contr) && defined('CUSTOM_CONTROLLER') && file_exists($script=USER_CONTROLLERS_PATH.CUSTOM_CONTROLLER.'.php')){	
		$contr = CUSTOM_CONTROLLER;
	}
	else if (!isset($contr)){
		$contr = 'Controller';
		$script=FRAME_WORK_PATH.'basic_classes/Controller.php'; 
	}
	//checking if method is allowed
	if (isset($meth)){
		if (!isset($_SESSION['LOGGED'])){
			$role_id = 'guest';
		}
		else{
			$role_id = $_SESSION['role_id'];
		}
		require(FUNC_PATH.'role_permissions.php');
		//throw new Exception($contr.'__'.$meth.'__'.$role_id);
		if (!method_allowed_for_role($contr,$meth,$role_id)){
			if (!isset($_SESSION['LOGGED'])){
				throw new Exception(ERR_AUTH_NOT_LOGGED);
			}
			else{		
				throw new Exception(ERR_COM_METH_PROHIB);
			}
		}
	}
	
	/* including controller */	
	require_once($script);
	$contrObj = new $contr($dbLinkMaster,$dbLink);

	/* view checking*/
	if (!isset($view)){
		$def_view = $contrObj->getDefaultView();
		$view = (isset($def_view))? $def_view:DEF_VIEW;
		if (!isset($view)){
			throw new Exception(ERR_COM_NO_VIEW);
		}	
	}

	$view_class = $view;
	if (!file_exists($v_script=USER_VIEWS_PATH.$view.'.php')){	
		$pathArray = explode(PATH_SEPARATOR, get_include_path());	
		$v_script = (count($pathArray)>=1)?
			$pathArray[1].'/'.FRAME_WORK_PATH.'basic_classes/'.$view.'.php' :
			USER_VIEWS_PATH.$view.'.php';
		
		if (!file_exists($v_script)){	
			if (file_exists($v_script=USER_VIEWS_PATH.DEF_VIEW.'.php')){
				$view_class = DEF_VIEW;
			}
			else{
				throw new Exception(ERR_COM_NO_VIEW);
			}
		}
	}
	
	require_once($v_script);

	$contrObj->runPablicMethod($meth,$_REQUEST);	
	$contrObj->write($view_class,$view);
}
catch (Exception $e){
	$contrObj = new Controller();	
	$resp = new ModelServResponse();				
	$contrObj->addModel($resp);	
	$ar = explode('@',$e->getMessage());
	$er_code=(count($ar)>1)? $ar[1]:1;
	$resp->result = $er_code;
	if (count($ar)){
		$resp->descr = htmlspecialchars($ar[0]);	
	}
	$view = (isset($_REQUEST[PARAM_VIEW]))? $_REQUEST[PARAM_VIEW]:DEF_VIEW;
	/*
	if (!isset($view)){
		$view = (isset($_REQUEST[PARAM_VIEW]))? $_REQUEST[PARAM_VIEW]:DEF_VIEW;
	}
	*/
	if (!isset($v_script)){
		//not included yet
		if (!file_exists($v_script=USER_VIEWS_PATH.$view.'.php')){	
			$pathArray = explode(PATH_SEPARATOR, get_include_path());	
			$v_script = (count($pathArray)>=1)?
				$pathArray[1].'/'.FRAME_WORK_PATH.'basic_classes/'.$view.'.php' :
				USER_VIEWS_PATH.$view.'.php';
		}
		/*
		if (!file_exists($v_script)){
			$v_script = USER_VIEWS_PATH.DEF_VIEW.'.php';
		}
		*/
		require_once($v_script);		
	}
	
	$contrObj->write($view,$view,$er_code);
}
/*
try{
	$dbLinkMaster->close();
	$dbLink->close();
}
catch (Exception $e){
}
*/
?>
