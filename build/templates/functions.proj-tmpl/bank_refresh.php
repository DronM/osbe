<?php
require_once('db_con.php');
require_once(USER_CONTROLLERS_PATH.'Bank_Controller.php');

	Bank_Controller::refresh($dbLink);
?>
