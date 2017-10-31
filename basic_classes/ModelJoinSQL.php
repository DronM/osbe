<?php
class ModelJoinSQL {	
	const SQL_STATEMENT = '%s JOIN `%s`.`%s` ON %s';
	const DEF_JOIN = 'LEFT OUTER';
	const SQL_KEY = '`%s`.`%s`.`%s`=`%s`.`%s`.`%s`';
	
	private $fields=array();
	private $joinFields=array();
	
	public function fieldExists($fieldId){
		return array_key_exists($fieldId,$this->fields);
	}
	public function getFieldById($fieldId){
		return $this->fields[$fieldId];
	}
	
	public function addField($field,$join=NULL){
		$full_name = $field->getSQLNoAlias();
		if (!array_key_exists($full_name,$this->joinFields)){
			$this->fields[$field->getId()]=
				array('field'=>$field,
					  'join'=>($join==NULL)? ModelJoinSQL::DEF_JOIN:$join
				);
			array_push($this->joinFields,$full_name);
		}
	}
	public function getSQL(){
		$res = '';
		if (count($this->fields)){
			foreach ($this->fields as $field){
				$res.=($res=='')? '':' ';
				$keys_ar = $field['field']->getLookUpKeys();
				$keys = '';
				foreach ($keys_ar as $key=>$key_lup){
					$keys.= ($keys=='')? '':' ';
					$keys.= sprintf(ModelJoinSQL::SQL_KEY,
						$field['field']->getDbName(),
						$field['field']->getTableName(),
						$key,
						$field['field']->getLookUpDbName(),
						$field['field']->getLookUpTableName(),
						$key_lup
						);
				}
				$res.= sprintf(
					ModelJoinSQL::SQL_STATEMENT,
					$field['join'],
					$field['field']->getDbName(),
					$field['field']->getTableName(),
					$keys
					);
			}
			return $res;
		}
		return "";
	}
}
?>