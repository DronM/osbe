<?php
require_once(FRAME_WORK_PATH.'basic_classes/ControllerSQL.php');
class ControllerSQLDOC extends ControllerSQL{

	const ERR_NO_DEF_DATE = 'Нет значения по умолчанию для даты!';

	public function __construct($dbLinkMaster=NULL,$dbLink=NULL){
		parent::__construct($dbLinkMaster,$dbLink);
	}
	public function before_open($pm){
		$link = $this->getDbLinkMaster();
		$model_id = $this->getInsertModelId();
		$model = new $model_id($link);
		$link->query(sprintf("SELECT %s_before_open(%d,%d)",
			$model->getTableName(),$_SESSION['LOGIN_ID'],
			$pm->getParamValue('doc_id')
			)
		);
	}
	public function get_actions($pm){
		$link = $this->getDbLinkMaster();
		$model_id = $this->getInsertModelId();
		$model = new $model_id($link);	
		$this->addNewModel(
			sprintf("SELECT * FROM %s_get_actions(%d)",
			$model->getTableName(),
			$pm->getParamValue('doc_id'))		
		,'get_actions');	
		
	}	
	
}	

