<?php
require_once(FRAME_WORK_PATH.'basic_classes/FieldExt.php');
require_once(FRAME_WORK_PATH.'Constants.php');
require_once(FRAME_WORK_PATH.'basic_classes/ValidatorDateTime.php');

class FieldExtDateTime extends FieldExt {
	public function __construct($id,$options=false) {
		parent::__construct($id,DT_DATETIME, $options);
		$this->setValidator(new ValidatorDateTime());
	}
}
?>