<?php
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQL.php');
require_once(FRAME_WORK_PATH.'Constants.php');

class FieldSQLGeomPolygon extends FieldSQL{
	public function __construct($dbLink,$dbName, $tableName,
					$id, $options=false) {
		parent::__construct($dbLink,$dbName, $tableName,
				$id, DT_GEOM_POLYGON,$options);
	}
    public function getValueForDb(){
		$val = parent::getValueForDb();
		$formated = null;
		FieldSQLGeomPolygon::formatForDb($val,$formated);
		return $formated;
    }
    public static function formatForDb($valIn,&$valOut){
		if (is_null($valIn)||$valIn==''){
			$valOut='null';
			return;
		}	
		$points = explode(',',$valIn);
		if (count($points)){
			array_push($points,$points[0]);
			$valOut = sprintf("ST_GeomFromText('POLYGON((%s))',4326)",
				implode(',',$points));
		}		
    }
	
}
?>