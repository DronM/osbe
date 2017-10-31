<?php

require_once('ModelTextOutput.php');

class ModelTemplate extends ModelTextOutput{

	public function __construct($templateId,$dataStr=NULL,$attrs=NULL){
		if (!$attrs){
			$attrs = array();
		}
		$attrs['templateId'] = $templateId;
		$attrs['sysModel'] = "1";
		
		//Setting Template id
		$dataStr = str_replace('{{id}}',$templateId,$dataStr);
		
		parent::__construct($templateId.'-template',$dataStr,$attrs);
	}
}
?>
