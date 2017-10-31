<?php
require_once(FRAME_WORK_PATH.'basic_classes/Model.php');
require_once(FRAME_WORK_PATH.'basic_classes/Field.php');

class ModelCss extends Model {
	public function __construct($href){
		parent::__construct(array('sysModel'=>TRUE));
		$this->addField(new Field('href',DT_STRING));
		$this->insert();
		$this->href = $href;
	}
}
?>
