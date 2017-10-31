<?php
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtString.php');

class FieldExtJSON extends FieldExtString {
	public function __construct($id,$options=false) {
		parent::__construct($id,$options);
	}
}
?>
