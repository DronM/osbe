<?php
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQL.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLString.php');
require_once(FRAME_WORK_PATH.'Constants.php');

class FieldSQLEnum extends FieldSQL{
	public function __construct($dbLink,$dbName, $tableName,
					$id, $options=false) {
		parent::__construct($dbLink,$dbName, $tableName,
				$id,DT_ENUM,$options);
	}
	public function formatVal($val){
		if ($val=='null'){
			return $val;
		}
		if ($val=='undefined'){
			return 'null';
		}
		
		$formated = null;
		FieldSQLString::formatForDb($this->getDbLink(),$val,$formated);
		return $formated;				
	}
    public function getValueForDb(){
		$val = parent::getValueForDb();
		return $this->formatVal($val);
    }
    public function getOldValueForDb(){
		$val = parent::getOldValueForDb();
		return $this->formatVal($val);		
    }
	
}
?>