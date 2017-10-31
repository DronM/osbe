<?php
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQL.php');
require_once(FRAME_WORK_PATH.'Constants.php');

class FieldSQLBigInt extends FieldSQL{
	public function __construct($dbLink,$dbName, $tableName,
					$id, $options=false) {
		parent::__construct($dbLink,$dbName, $tableName,
				$id, DT_INT_BIG,$options);
	}
    public static function formatForDb($valIn,&$valOut){
		$valOut = $valIn;
    }	
	
}
?>
