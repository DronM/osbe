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


class CondParamsSQL {
	const PARAM_FIELDS = 'cond_fields';
	const PARAM_SGNS = 'cond_sgns';
	const PARAM_VALS = 'cond_vals';
	const PARAM_ICS = 'cond_ic';
	const PARAM_SEPAR = ',';
	
	const ER_VAL_CNT = 'Количество значений условий не совпадает с количеством полей!';
	
	private $dbLink;
	private $params;

	public function __construct($pm,$dbLink){
		$this->dbLink = $dbLink;
		$this->params = array();
		$this->parse($pm);
	}

	private function parse($pm){
		$val = $pm->getParamValue(CondParamsSQL::PARAM_FIELDS);
		if (isset($val)){
			$field_sep = $pm->getParamValue('field_sep');			
			$field_sep = ($field_sep)? $field_sep:CondParamsSQL::PARAM_SEPAR;
			
			$condFields = explode($field_sep,$val);
			$cnt = count($condFields);
			if ($cnt>0){		
				$val = $pm->getParamValue(CondParamsSQL::PARAM_SGNS);
				$condSgns = (isset($val))? explode($field_sep,$val):array();
				$val = $pm->getParamValue(CondParamsSQL::PARAM_VALS);
				$condVals = (isset($val))? explode($field_sep,$val):array();				
				$val = $pm->getParamValue(CondParamsSQL::PARAM_ICS);
				$condInsen = (isset($val))? explode($field_sep,$val):array();
				
				$sgn_keys_ar = explode(',',COND_SIGN_KEYS);
				$sgn_ar = explode(',',COND_SIGNS);
				
				if (count($condVals)!=$cnt){
					throw new Exception(CondParamsSQL::ER_VAL_CNT);
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
					
					$ic = (count($condInsen)>$i)? ($condInsen[$i]=='1'):FALSE;
					$this->params[$condFields[$i].'_'.$sgn_keys_ar[$sgn_ind]]=
						array('id'=>$condFields[$i],
						'sgn'=>$sgn_ar[$sgn_ind],
						'ic'=>$ic,
						'val'=>$condVals[$i]);
				}
			}
		}	
	}
	
	public function paramExists($id,$sgn){
		return array_key_exists($id.'_'.$sgn,$this->params);
	}

	public function getVal($id,$sgn){		
		if (!$this->paramExists($id,$sgn)){
			throw new Exception(sprintf("Param '%s' with operand '%s' not found.",$id,$sgn));
		}
		return $this->params[$id.'_'.$sgn]['val'];
	}
	public function getValForDb($id,$sgn,$dataType){		
		$val = $this->getVal($id,$sgn);
		$val_db = NULL;
		
		if ($dataType==DT_INT || $dataType==DT_INT_UNSIGNED){
			$f = new FieldExtInt($id);
			FieldSQLInt::formatForDb($f->validate($val),$val_db);
		}
		else if ($dataType==DT_STRING || $dataType==DT_EMAIL){
			$f = new FieldExtString($id);
			FieldSQLString::formatForDb($this->dbLink,$f->validate($val),$val_db);
		}
		else if ($dataType==DT_FLOAT_UNSIGNED || $dataType==DT_FLOAT){
			$f = new FieldExtFloat($id);
			FieldSQLFloat::formatForDb($f->validate($val),$val_db);
		}
		else if ($dataType==DT_BOOL){
			$f = new FieldExtBool($id);
			FieldSQLBool::formatForDb($f->validate($val),$val_db);
		}
		else if ($dataType==DT_TEXT){
			$f = new FieldExtString($id);
			FieldSQLString::formatForDb($this->dbLink,$f->validate($val),$val_db);
		}
		else if ($dataType==DT_DATETIME){
			$f = new FieldExtDateTime($id);
			FieldSQLDateTime::formatForDb($f->validate($val),$val_db);
		}
		else if ($dataType==DT_DATE){
			$f = new FieldExtDate($id);
			FieldSQLDate::formatForDb($f->validate($val),$val_db);
		}
		else if ($dataType==DT_TIME){
			$f = new FieldExtTime($id);
			FieldSQLTime::formatForDb($f->validate($val),$val_db);
		}
		else if ($dataType==DT_PWD){
			$f = new FieldExtPassword($id);
			FieldSQLString::formatForDb($this->dbLink,$f->validate($val),$val_db);
		}
		else if ($dataType==DT_ENUM){
			$f = new FieldExtEnum($id);
			FieldSQLString::formatForDb($this->dbLink,$f->validate($val),$val_db);
		}
		return $val_db;
	}
}

?>
