<?php
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQL.php');
require_once(FRAME_WORK_PATH.'Constants.php');

class FieldSQLSmallInt extends FieldSQL{
	public function __construct($dbLink,$dbName, $tableName,
					$id, $options=false) {
		parent::__construct($dbLink,$dbName, $tableName,
				$id, DT_INT_SMALL,$options);
	}
    public static function formatForDb($valIn,&$valOut){
		$valOut = $valIn;
    }	
	
}
?>
