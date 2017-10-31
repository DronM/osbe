<?php
require_once(FRAME_WORK_PATH.'basic_classes/Validator.php');

class ValidatorPassword extends ValidatorString {
	public function validate($val){
		return parent::validate($val);
	}	
	
}

?>
