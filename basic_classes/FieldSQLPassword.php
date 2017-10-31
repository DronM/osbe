<?php
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQL.php');
require_once(FRAME_WORK_PATH.'Constants.php');

class FieldSQLPassword extends FieldSQL{	
	public function __construct($dbLink,$dbName, $tableName,
					$id, $options=false) {
		parent::__construct($dbLink,$dbName, $tableName,
				$id, DT_PWD,$options);
	}	
    public function getValueForDb(){
		$val = parent::getValueForDb();
		$formatted = null;
		FieldSQLPassword::formatForDb($this->getDbLink(),$val,$formatted);
		return $formatted;
    }
    public function getOldValueForDb(){
		$val = parent::getOldValueForDb();
		$formatted = null;
		FieldSQLPassword::formatForDb($this->getDbLink(),$val,$formatted);
		return $formatted;
    }
    public static function formatForDb($dbLink,$valIn,&$valOut){
		if (is_null($valIn) OR $valIn=='null'){
			throw new Exception('Пустой пароль!');
		}
		$valOut = "'".md5($dbLink->escape_string($valIn))."'";
    }	
	
}
?>