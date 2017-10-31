<?php
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQL.php');
require_once(FRAME_WORK_PATH.'Constants.php');

class FieldSQLDateTime extends FieldSQL{
	public function __construct($dbLink,$dbName, $tableName,
					$id, $options=false) {
		parent::__construct($dbLink,$dbName, $tableName,
				$id, DT_DATETIME,$options);
	}
    public function formatVal($val){
		if (strtolower($val)=='null'||!strlen($val)){
			return 'null';
		}		
		$formated = null;
		FieldSQLDateTime::formatForDb($val,$formated);
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
	
    public static function formatForDb($valIn,&$valOut){		
		$valOut = ($valIn=='null')? $valIn:"'".date('Y-m-d H:i:s',$valIn)."'";
    }
	
}
?>