<?php
require_once(FRAME_WORK_PATH.'basic_classes/FieldExt.php');
require_once(FRAME_WORK_PATH.'Constants.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtDateTime.php');
require_once(FRAME_WORK_PATH.'basic_classes/ValidatorDateTimeTZ.php');

class FieldExtDateTimeTZ extends FieldExtDateTime {
	public function __construct($id,$options=false) {
		parent::__construct($id,DT_DATETIME, $options);
		$this->setValidator(new ValidatorDateTimeTZ());
	}
}
?>
