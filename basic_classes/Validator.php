<?php
class Validator{
	const ER_INVALID_VALUE = "неверное значение для типа '%s'";
	public function validate($val){
		$val = trim($val);
		$l = strtolower($val);
		if (!$val || !strlen($val) || $l=='undefined' || $l=='null'){
			return 'null';
		}	
	
		return $val;
	}	
}

?>
