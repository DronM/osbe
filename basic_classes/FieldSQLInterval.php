<?php
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLTime.php');
require_once(FRAME_WORK_PATH.'Constants.php');

class FieldSQLInterval extends FieldSQLTime{
	public function __construct($dbLink,$dbName, $tableName,
					$id, $options=false) {
		parent::__construct($dbLink,$dbName, $tableName,
				$id, DT_INTERVAL,$options);
	}
}
?>
