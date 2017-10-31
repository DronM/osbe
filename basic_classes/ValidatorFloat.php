<?php
require_once(FRAME_WORK_PATH.'basic_classes/Validator.php');

class ValidatorFloat extends Validator {
	private $unsigned=TRUE;
	
	public function __construct($unsigned=TRUE) {
		$this->unsigned = $unsigned;
	}
	
	public function validate($val){
		$val = trim($val);
		$l = strtolower($val);
		if (!strlen($val) || $l=='undefined' || $l=='null' || $l=='nan'){
			return 'null';
		}	
		    	
		$val = preg_replace('/,/','.',$val);
		$check = str_replace('.','',$val);
		if (!$this->unsigned){
			$check = str_replace('-','',$check);
		}
		$val = ($val=='')? 'null':$val;
		if ($val!='null'&&!ctype_digit($check)){
			$dig_type = ($this->unsigned)? 'дробное без знака':'дробное со знаком';
			throw new Exception(sprintf(Validator::ER_INVALID_VALUE,$dig_type));
		}
		return $val;
	}
}
?>
