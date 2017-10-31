<?php

require_once('ModelTextOutput.php');

class ModelMenu extends ModelTextOutput{

	public function __construct($id,$dataStr=NULL,$attrs=NULL){
		if (!$attrs){
			$attrs = array();
		}
		$attrs['menu'] = 'TRUE';
		$attrs['sysModel'] = '1';
		
		parent::__construct($id,$dataStr,$attrs);
	}
}
?>
