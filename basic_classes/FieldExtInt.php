<?php
require_once(FRAME_WORK_PATH.'basic_classes/FieldExt.php');
require_once(FRAME_WORK_PATH.'Constants.php');
require_once(FRAME_WORK_PATH.'basic_classes/ValidatorInt.php');

class FieldExtInt extends FieldExt{
	private $unsigned=TRUE;
	
	public function __construct($id,$options=false) {
		parent::__construct($id,DT_INT, $options);
		if ($options
		&&is_array($options)
		&&isset($options['unsigned'])
		&&!$options['unsigned']){
			$this->unsigned = FALSE;
		}
		$this->setValidator(new ValidatorInt($this->unsigned));
	}
	public function setUnsigned($unsigned){
		return $this->unsigned = $unsigned;
	}	
	public function getUnsigned(){
		return $this->unsigned;
	}
	
}
?>