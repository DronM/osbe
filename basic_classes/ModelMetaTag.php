<?php
require_once(FRAME_WORK_PATH.'basic_classes/Model.php');
require_once(FRAME_WORK_PATH.'basic_classes/Field.php');

class ModelMetaTag extends Model {
	public function __construct($name,$content){
		parent::__construct();
		$this->addField(new Field('name',DT_STRING));
		$this->addField(new Field('content',DT_STRING));
		$this->insert();
		$this->name = $name;
		$this->content = $content;		
		
	}
}
?>