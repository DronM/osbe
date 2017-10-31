<?php
require_once(FRAME_WORK_PATH.'basic_classes/ModelSQL.php');

class ModelSQLWithGeoZone extends ModelSQL{
	private function get_zone_val($val){
		$points = explode(',',$val);
		if (count($points)){
			array_push($points,$points[0]);
			return sprintf("ST_GeomFromText('POLYGON((%s))')",
				implode(',',$points));
		}	
	}
	
	public function update(){
		$this->queryId = 0;
		$cond_str = '';
		$assigne_str = '';
		
		$fields = $this->getFieldIterator();
		while($fields->valid()) {
			$field = $fields->current();
			if ($field->getFieldType()==FT_DATA){
				if (!is_null($field->getValue())){
					$assigne_str.= ($assigne_str=="")? "":",";
					if ($field->getId()=='zone'){
						$assigne_str.= 'zone='.$this->get_zone_val($field->getValue());
					}
					else{
						$assigne_str.= $field->getSQLAssigne();
					}
				}
				if (!is_null($field->getOldValue())){
					$cond_str.= ($cond_str=="")? "":",";
					$cond_str.= $field->getSQLAssigneOldValue();
				}
			}
			else if ($field->getFieldType()==FT_LOOK_UP){
				if (!is_null($field->getLookUpIdValue())){
					$assigne_str.= ($assigne_str=="")? "":",";
					$assigne_str.= $field->getSQLLookUpAssigne();
				}
			}
			$fields->next();
		}
		$q = sprintf(ModelSQL::SQL_UPDATE,
			$this->getDbName(),$this->getTableName(),
			$assigne_str,$cond_str
			);
		//throw new Exception($q);
		$this->getDbLink()->query($q);	
	}
	public function insert($needId=FALSE){
		$this->queryId = 0;
		$field_str = '';
		$value_str = '';
		$ids_list = '';
		$fields = $this->getFieldIterator();
		while($fields->valid()) {
			$field = $fields->current();
			$field_data_type = $field->getFieldType();
			$needed_types = ($field_data_type==FT_DATA || $field_data_type==FT_LOOK_UP);
			$is_primary = $field->getPrimaryKey();
			$skeep = (!$needed_types
				|| $field->getReadOnly()				
				|| ($is_primary && $field->getAutoInc())
				);
				
			if ($needId && $is_primary){
				$ids_list.=($ids_list=='')? '':',';
				$ids_list.=$field->getSQLNoAlias();
			}
				
			if (!$skeep){
				$field_str.= ($field_str=='')? '':',';
				$value_str.= ($value_str=='')? '':',';				
				$field_str.= $field->getSQLNoAlias();				
				if ($field->getId()=='zone'){
					$value_str.= $this->get_zone_val($field->getValue());
				}
				else{				
					$value_str.= $field->getValueForDb();
				}
			}
			$fields->next();
		}
		$q = sprintf(ModelSQL::SQL_INSERT,
			$this->getDbName(),$this->getTableName(),
			$field_str,$value_str);
		if ($needId){
			$q.=' returning '.$ids_list;
		}
		//throw new Exception('ModelSQL insert q='.$q);
		$this->queryId = $this->getDbLink()->query($q);
		
		if ($needId){
			$ret = $this->getDbLink()->fetch_array($this->queryId);
		}
		else{
			$ret = NULL;
		}
		return $ret;
	}

}
?>