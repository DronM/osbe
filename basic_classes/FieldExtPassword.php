<?php
require_once(FRAME_WORK_PATH.'basic_classes/FieldExt.php');
require_once(FRAME_WORK_PATH.'Constants.php');
require_once(FRAME_WORK_PATH.'basic_classes/ValidatorPassword.php');

class FieldExtPassword extends FieldExt {
	public function __construct($id,$options=false) {
		parent::__construct($id,DT_PWD, $options);
		$this->setValidator(new ValidatorPassword());
	}
	public function isEmpty($val){
		$value_set =(isset($val) && $val!='');		
		return !$value_set;
	}
	
}
?>