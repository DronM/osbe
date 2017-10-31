<?php
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQL.php');
require_once(FRAME_WORK_PATH.'Constants.php');

class FieldSQLTime extends FieldSQL{
	public function __construct($dbLink,$dbName, $tableName,
					$id, $options=false) {
		parent::__construct($dbLink,$dbName, $tableName,
				$id, DT_TIME,$options);
	}
    public function formatVal($val){
		if ($val=='null'){
			$val = '00:00';
		}
		$formated = null;
		self::formatForDb($val,$formated);
		return $formated;		
    }
    public function getValueForDb(){
		$val = parent::getValueForDb();
		return $this->formatVal($val);
    }
	
    public static function formatForDb($valIn,&$valOut){
		$valOut = "'".$valIn."'";
    }
	
}
?>
