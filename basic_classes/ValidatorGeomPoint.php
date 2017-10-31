<?php
require_once(FRAME_WORK_PATH.'basic_classes/Validator.php');

class ValidatorGeomPoint extends Validator {
	public function validate($val){
		$val = trim($val);
		$l = strtolower($val);
		if (!$val || !strlen($val) || $l=='undefined' || $l=='null'){
			return 'null';
		}	
		return sprintf("ST_PointFromText('%s',4326)",$val);
	}
}

?>
