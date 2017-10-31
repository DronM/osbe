<?php
require_once(FRAME_WORK_PATH.'basic_classes/Validator.php');

class ValidatorDate extends Validator {
	public function validate($val){
		$val = trim($val);
		$l = strtolower($val);
		if (!$val || !strlen($val) || $l=='undefined' || $l=='null'){
			return 'null';
		}	
		
		$DATE_SEPARATOR = '.';
	
		$cor_val = $val;
		$cor_val = preg_replace('/\//',$DATE_SEPARATOR,$cor_val);
		$cor_val = preg_replace('/-/',$DATE_SEPARATOR,$cor_val);
		
		$date_parts = explode($DATE_SEPARATOR,$cor_val);
		if (count($date_parts)<3){
			throw new Exception(sprintf(Validator::ER_INVALID_VALUE,'Дата'));
		}
		if (strlen($date_parts[0])==4){
			list($y,$m,$d) = $date_parts;
		}
		else{
			list($d,$m,$y) = $date_parts;
		}
		$m = intval($m);
		$d = intval($d);
		$y = intval($y);
		
		if (strlen($cor_val)==8){
			//short year			
			$y+=2000;
		}
		
		if (sizeof($date_parts) == 3
			&& checkdate($m,$d,$y)){
		}
		else{
			throw new Exception(sprintf(Validator::ER_INVALID_VALUE,'Дата'));
		}
		
		/*
		$check = explode($DATE_SEPARATOR,$cor_val);
		if (sizeof($check) == 3
			&& checkdate(
			intval($check[1]),
			intval($check[0]),
			intval($check[2]))
			){
		}
		else{
			throw new Exception(sprintf(Validator::ER_INVALID_VALUE,'Дата'));
		}		
		return strtotime(intval($check[2]).'-'.intval($check[1]).'-'.intval($check[0]));
		*/
		return strtotime($d.$DATE_SEPARATOR.$m.$DATE_SEPARATOR.$y);
	}	

}

?>
