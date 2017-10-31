<?php
require_once(FRAME_WORK_PATH.'basic_classes/ControllerSQL.php');
require_once(FRAME_WORK_PATH.'basic_classes/ParamsSQL.php');

class ControllerSQLDOCPl extends ControllerSQL{

	public function __construct($dbLinkMaster=NULL,$dbLink=NULL){
		parent::__construct($dbLinkMaster,$dbLink);
	}

	
	public function before_open($pm){
		$p = new ParamsSQL($pm,$this->getDbLink());
		$p->addAll();
		
		$link = $this->getDbLinkMaster();
		$model_id = $this->getInsertModelId();
		$model = new $model_id($link);
		$link->query(sprintf("SELECT %s_before_open(%s,%d,%d)",
			$model->getTableName(),
			$p->getDbVal('view_id'),
			$_SESSION['LOGIN_ID'],
			$p->getDbVal('doc_id')
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
	
	/*
	public function get_doc($pm){
		if (isset($_REQUEST['t'])){
			$date_field = 'date_time';			
			
			$ar = $this->getDbLink()->query_first(sprintf(
			"WITH params AS (
				SELECT val from teplate_params_get_list('%s'::text, '%s'::text, %d)
			)
			SELECT
				template_params_date_val((SELECT val FROM params), true) AS date_from,
				template_params_date_val((SELECT val FROM params), false) AS date_to",
			$_REQUEST['t'],
			$date_field,
			(isset($_SESSION['user_id']))? $_SESSION['user_id']:0
			));
			
			$this->addModel(new ModelVars(
				array('id'=>'JournalDefDate_Model',
					'values'=>array(
						new Field('date_from',DT_STRING,
							array('value'=>$ar['date_from'])),
						new Field('date_to',DT_STRING,
							array('value'=>$ar['date_to']))
						)
				)
			));		
			
		}
		
		$model_id = $this->getListModelId();
		if (!isset($model_id)){
			throw new Exception(self::ER_NO_LIST_MODEL);
		}
		$model = new $model_id($this->getDbLink());		
		$where = new ModelWhereSQL();
		$this->methodParamsToWhere($where,$pm,$model);		

		$view_id = md5(uniqid());		
		$model_ins_id = $this->getInsertModelId();
		$model_ins = new $model_ins_id($this->getDbLink());
		$this->getDbLinkMaster()->query( sprintf("SELECT %s_before_open('%s',%d)",$model_ins->getTableName(),$view_id,$model->getFieldById('id')->getValueForDb()) );
		
		$model->setSelectQueryText( sprintf("SELECT *,'%s' AS view_id FROM %s %s",$view_id,$model->getTableName(),$where->getSQL()) );
		
		$model->addGlobalFilter($where);
		$limit = new ModelLimitSQL(1);
		$model->select(FALSE,$where,NULL,
			$limit,NULL,NULL,NULL,
			FALSE,TRUE);

		$this->addModel($model);
	}
	*/	
}	

