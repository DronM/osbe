<?php
require_once(FRAME_WORK_PATH.'basic_classes/Validator.php');

class ValidatorInt extends Validator {
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
		    	
		$check = (!$this->unsigned)? str_replace('-','',$val):$val;
		
		$val = ($val=='')? 'null':$val;
		if ($val!='null' && !ctype_digit($check)){
			$dig_type = ($this->unsigned)? 'целое без знака':'целое со знаком';
			throw new Exception(sprintf(Validator::ER_INVALID_VALUE,$dig_type));
		}		
		
		/*
		else if ($val!='null'&&!$this->unsigned){
			if (substr($val,0,1)=='-'){
				//negative
				$val_for_check = substr($val,1);
			}
			else{
				$val_for_check = $val;
			}
			if (!ctype_digit($val_for_check)){
				throw new Exception(sprintf(Validator::ER_INVALID_VALUE,'целое со знаком'));
			}
		}
		*/
		return $val;
	}
}

?>
