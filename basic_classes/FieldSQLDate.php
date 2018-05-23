<?php
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQL.php');
require_once(FRAME_WORK_PATH.'Constants.php');

class FieldSQLDate extends FieldSQL{
	public function __construct($dbLink,$dbName, $tableName,
					$id, $options=false) {
		parent::__construct($dbLink,$dbName, $tableName,
				$id, DT_DATE,$options);
	}
    public function formatVal($val){
		if (strtolower($val)=='null'){
			//$val = mktime(0, 0, 0, 0, 0, 0);
			return 'null';
		}		
		$formated = null;
		FieldSQLDate::formatForDb($val,$formated);
		return $formated;
    }
	
    public function getValueForDb(){
		$val = parent::getValueForDb();
		if (strtolower($val)=='now()' ||strtolower($val)=='now()::date' || strtolower($val)=='current_timestamp'){
			return $val;
		}		
		return $this->formatVal($val);
    }
    public function getOldValueForDb(){
		$val = parent::getOldValueForDb();
		return $this->formatVal($val);
    }
	
    public static function formatForDb($valIn,&$valOut){
		//throw new Exception($valIn);
		if (strtolower($valIn)=='null'){
			$valOut = 'null';
		}
		else{
			$valOut = "'".date('Y-m-d',$valIn)."'";
		}
    }
	
}
?>
