<?php
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtString.php');

class FieldExtChar extends FieldExtString {
	public function __construct($id,$options=false) {
		parent::__construct($id, $options);
	}
}
?>