<?php
require_once(FRAME_WORK_PATH.'basic_classes/Model.php');
require_once(FRAME_WORK_PATH.'basic_classes/Field.php');

class ModelVars extends Model {
	public function __construct($options=NULL){
		parent::__construct($options);
		if (!is_null($options)){
			/*
				if there is a `values` value
				it must be an array of Field
				objects with preset value fields
			*/
			if (isset($options['values'])
			&& is_array($options['values'])
			&& count($options['values'])){
				foreach ($options['values'] as $field){
					$this->addField($field);
				}
				$this->insert();
			}
		}
	}
	
	public function metaDataToXML(){
		return '';
	}
}
?>