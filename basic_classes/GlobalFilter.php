<?php
class GlobalFilter {
	private static function hash($modelId){
		return md5('globalFilter_'.$modelId);
	}
	public static function set($modelId,$filter){		
		$_SESSION[GlobalFilter::hash($modelId)]
			= serialize($filter);
	}
	public static function delete($modelId){
		$hash = GlobalFilter::hash($modelId);
		if (isset($_SESSION[$hash])){
			unset($_SESSION[$hash]);
		}		
	}
	public static function get($modelName){
		$hash = GlobalFilter::hash($modelName);
		if (isset($_SESSION[$hash])){
			return unserialize($_SESSION[$hash]);
		}
		return NULL; 
	}
	
}
?>