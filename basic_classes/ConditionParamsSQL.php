<?php
require_once(FRAME_WORK_PATH.'Constants.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLBool.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLChar.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLDate.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLDateTime.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLFloat.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLInt.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLString.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLTime.php');

require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLGeomPoint.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLGeomPolygon.php');

require_once(FRAME_WORK_PATH.'basic_classes/FieldExtBool.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtChar.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtDate.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtDateTime.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtFloat.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtInt.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtString.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtTime.php');

require_once(FRAME_WORK_PATH.'basic_classes/FieldExtGeomPoint.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtGeomPolygon.php');


class ConditionParamsSQL {
	const PARAM_FIELDS = 'cond_fields';
	const PARAM_SGNS = 'cond_sgns';
	const PARAM_VALS = 'cond_vals';
	const PARAM_ICS = 'cond_ic';
	const PARAM_SEPAR = ',';
	
	const ER_VAL_CNT = 'Количество значений условий не совпадает с количеством полей!';
	const ER_PARAM_NOT_FOUND = 'Параметр %s с условием %s не найден!';
	
	private $dbLink;
	private $params;

	public function __construct($pm,$dbLink,$fields=NULL){
		$this->dbLink = $dbLink;
		$this->params = array();
		$this->parse($pm,$fields);
		//throw new Exception("Params=".var_export($this->params));
	}

	private function parse($pm,$fields){
		$val = $pm->getParamValue(ConditionParamsSQL::PARAM_FIELDS);
		if (isset($val)){
			$field_sep = $pm->getParamValue('field_sep');			
			$field_sep = ($field_sep)? $field_sep:ConditionParamsSQL::PARAM_SEPAR;
		
			$condFields = explode($field_sep,$val);
			$cnt = count($condFields);			
			if ($cnt>0){		
				$val = $pm->getParamValue(ConditionParamsSQL::PARAM_SGNS);
				$condSgns = (isset($val))? explode($field_sep,$val):array();
				$val = $pm->getParamValue(ConditionParamsSQL::PARAM_VALS);
				$condVals = (isset($val))? explode($field_sep,$val):array();				
				$val = $pm->getParamValue(ConditionParamsSQL::PARAM_ICS);
				$condInsen = (isset($val))? explode($field_sep,$val):array();
				
				$sgn_keys_ar = explode(',',COND_SIGN_KEYS);
				$sgn_ar = explode(',',COND_SIGNS);
				
				if (count($condVals)!=$cnt){
					throw new Exception(ConditionParamsSQL::ER_VAL_CNT);
				}
				
				for ($i=0;$i<$cnt;$i++){
					$sgn_ind = FALSE;
					if (count($condSgns)>$i){
						$sgn_ind = array_search($condSgns[$i],$sgn_keys_ar);
					}
					if ($sgn_ind ===FALSE){
						//default param
						$sgn_ind = array_search('e',$sgn_keys_ar);
					}
					$val = $condVals[$i];
					$val_db = NULL;
					if (isset($fields)&&array_key_exists($condFields[$i],$fields)){
							$val_db = NULL;
							$this->get_val($fields[$condFields[$i]],$val,$val_db);
					}
					$ic = (count($condInsen)>$i)? ($condInsen[$i]=='1'):FALSE;
					$this->params[$condFields[$i].'_'.$condSgns[$i]]=
						array('id'=>$condFields[$i],
						'sgn'=>$sgn_ar[$sgn_ind],
						'ic'=>$ic,
						'dbVal'=>$val_db,
						'val'=>$val
						);
				}
			}
		}
	}
	
	public function paramExists($id,$sgn){
		return array_key_exists($id.'_'.$sgn,$this->params);
	}

	private function get_val($dataType,&$val,&$val_db){
		if ($dataType==DT_INT || $dataType==DT_INT_UNSIGNED){
			$f = new FieldExtInt(NULL);
			$val = $f->validate($val);
			FieldSQLInt::formatForDb($val,$val_db);
		}
		else if ($dataType==DT_STRING || $dataType==DT_EMAIL){
			$f = new FieldExtString(NULL);
			$val = $f->validate($val);
			FieldSQLString::formatForDb($this->dbLink,$val,$val_db);
		}
		else if ($dataType==DT_FLOAT_UNSIGNED || $dataType==DT_FLOAT){
			$f = new FieldExtFloat(NULL);
			$val = $f->validate($val);
			FieldSQLFloat::formatForDb($val,$val_db);
		}
		else if ($dataType==DT_BOOL){
			$f = new FieldExtBool(NULL);
			$val = $f->validate($val);
			FieldSQLBool::formatForDb($val,$val_db);
		}
		else if ($dataType==DT_TEXT){
			$f = new FieldExtString(NULL);
			FieldSQLString::formatForDb($this->dbLink,$f->validate($val),$val_db);
		}
		else if ($dataType==DT_DATETIME){
			$f = new FieldExtDateTime(NULL);
			$val = $f->validate($val);
			FieldSQLDateTime::formatForDb($val,$val_db);
		}
		else if ($dataType==DT_DATE){
			$f = new FieldExtDate(NULL);
			$val = $f->validate($val);
			FieldSQLDate::formatForDb($val,$val_db);
		}
		else if ($dataType==DT_TIME){
			$f = new FieldExtTime(NULL);
			$val = $f->validate($val);
			FieldSQLTime::formatForDb($val,$val_db);
		}
		else if ($dataType==DT_PWD){
			$f = new FieldExtPassword(NULL);
			FieldSQLString::formatForDb($this->dbLink,$f->validate($val),$val_db);
		}
		else if ($dataType==DT_ENUM){
			$f = new FieldExtEnum(NULL);
			FieldSQLString::formatForDb($this->dbLink,$f->validate($val),$val_db);
		}
	}
	public function getDbVal($id,$sgn,$dataType=NULL){		
		if (!$this->paramExists($id,$sgn)){
			throw new Exception(sprintf(ConditionParamsSQL::ER_PARAM_NOT_FOUND,$id,$sgn));
		}
		if (!isset($this->params[$id.'_'.$sgn]['dbVal']) && isset($dataType)){
			$val = $this->params[$id.'_'.$sgn]['val'];
			$val_db = NULL;
			$this->get_val($dataType,$val,$val_db);
			$this->params[$id.'_'.$sgn]['dbVal'] = $val_db;
		}
		if (isset($this->params[$id.'_'.$sgn]['dbVal'])){
			return $this->params[$id.'_'.$sgn]['dbVal'];
		}
	}
	public function getVal($id,$sgn){
		if (!$this->paramExists($id,$sgn)){
			throw new Exception(sprintf(ConditionParamsSQL::ER_PARAM_NOT_FOUND,$id,$sgn));
		}
		return $this->params[$id.'_'.$sgn]['val'];
	}	
}
?>
