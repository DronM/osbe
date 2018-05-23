<?php
require_once(FRAME_WORK_PATH.'basic_classes/FieldExt.php');
require_once(FRAME_WORK_PATH.'Constants.php');
require_once(FRAME_WORK_PATH.'basic_classes/Validator.php');

class FieldExtBytea extends FieldExt{
	public function __construct($id,$options=false) {
		parent::__construct($id,DT_BYTEA, $options);
		$this->setValidator(new Validator());
	}
}
?>
