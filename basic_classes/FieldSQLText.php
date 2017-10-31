<?php
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLString.php');

class FieldSQLText extends FieldSQLString{
	public function __construct($dbLink,$dbName, $tableName,
					$id, $options=false) {
		parent::__construct($dbLink,$dbName, $tableName,
				$id,$options);
	}	
}
?>