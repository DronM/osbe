<?php
require_once(FRAME_WORK_PATH.'basic_classes/Validator.php');

class ValidatorTime extends Validator {
	public function validate($val){
		$val = trim($val);
		$l = strtolower($val);
		if (!$val || !strlen($val) || $l=='undefined' || $l=='null'){
			return 'null';
		}	
	
		$TIME_SEPARATOR = ':';
		$cor_val = $val;
		$cor_val = preg_replace('/\//',$TIME_SEPARATOR,$cor_val);
		$cor_val = preg_replace('/-/',$TIME_SEPARATOR,$cor_val);
		$cor_val = preg_replace('/_/','',$cor_val);
		
		
		$time_parts = explode($TIME_SEPARATOR,$cor_val);
		if (sizeof($time_parts)>=3){
			$h = intval($time_parts[0]);
			$min = intval($time_parts[1]);
			$sec = intval($time_parts[2]);
		}
		else if (sizeof($time_parts)==2){
			
			$h = intval($time_parts[0]);
			$min = intval($time_parts[1]);
			$sec = 0;
		}
		else if (sizeof($time_parts)==1){
			$h = intval($time_parts[0]);
			$min = 0;
			$sec = 0;
		}
		else{
			$h = 0;
			$min = 0;
			$sec = 0;		
		}
				
		return $h.$TIME_SEPARATOR.$min.$TIME_SEPARATOR.$sec;
	}	
}

?>
