<?php
require_once(FRAME_WORK_PATH.'basic_classes/FieldExt.php');
require_once(FRAME_WORK_PATH.'Constants.php');
require_once(FRAME_WORK_PATH.'basic_classes/ValidatorString.php');

class FieldExtString extends FieldExt {
	public function __construct($id,$options=false) {
		parent::__construct($id,DT_STRING, $options);
		$this->setValidator(new ValidatorString());
	}
	public function isEmpty($val){
		$value_set =(isset($val) && $val!='');		
		return !$value_set;
	}
	
}
?>