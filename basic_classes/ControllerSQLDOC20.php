<?php
require_once(FRAME_WORK_PATH.'basic_classes/ControllerSQL.php');
require_once(FRAME_WORK_PATH.'basic_classes/ParamsSQL.php');

class ControllerSQLDOC20 extends ControllerSQL{

	private $processable;

	const PARAM_VIEW = 'view_id';


	public function __construct($dbLinkMaster=NULL,$dbLink=NULL){
		parent::__construct($dbLinkMaster,$dbLink);
	}

	public function getProcessable(){
		return $this->processable;
	}
	public function setProcessable($v){
		$this->processable = $v;
	}
	
	public function processDoc($dataTable,$id){	
		$this->getDbLinkMaster()->query(sprintf("SELECT %s_act(%d)",$dataTable,$id));
	}

	public function set_unprocessed($pm){	
		$p = new ParamsSQL($pm,$this->getDbLink());
		$p->setValidated("doc_id");
		
		$model_id = $this->getInsertModelId();
		if (!isset($model_id)){
			throw new Exception(self::ER_NO_INSERT_MODEL);
		}
		
		$model = new $model_id($link);
		
		$link = $this->getDbLinkMaster();
		$link->query('BEGIN');
		try{			
			$link->query(sprintf("UPDATE %s SET processed=FALSE WHERE id=%d",$model->getTableName(),$p->getDbVal('doc_id')));
			$link->query(sprintf("SELECT %s_del_act(%d)",$model->getTableName(),$p->getDbVal('doc_id')));
			
			$link->query('COMMIT');
		}
		catch (Exception $e){
			$link->query('ROLLBACK');
			throw $e;
		}
	}
	
	public function insert($pm){	
	
		if ($pm->paramExists(self::PARAM_VIEW)){
			$p = new ParamsSQL($pm,$this->getDbLink());
			$p->setValidated("view_id");
		}
		//throw new Exception("ViewId=".$p->getDbVal('view_id'));
		$link = $this->getDbLinkMaster();
		
		$ids_ar = NULL;
		$ret_id = $pm->getParamValue('ret_id');
		
		$link->query('BEGIN');
		try{							
	
			$model_id = $this->getInsertModelId();
			if (!isset($model_id)){
				throw new Exception(self::ER_NO_INSERT_MODEL);
			}
			
			$model = new $model_id($link);
			$data_tb = $model->getTableName();
			
			$ids_ar = $this->modelInsert($model,1);

			if ($pm->paramExists(self::PARAM_VIEW)){
			
				$link->query(sprintf("SELECT %s_before_write(%s,%d)",
					$data_tb,
					$p->getDbVal('view_id'),
					$ids_ar['id']
				));				
			}

			if ($this->getProcessable()){
				$this->processDoc($data_tb,$ids_ar['id']);
			}

			//last inserted id
			$fields = array();
			foreach($ids_ar as $key=>$val){
				array_push($fields,new Field($key,DT_STRING,array('value'=>$val)));
			}
			$this->addModel(new ModelVars(
				array('id'=>'InsertedId_Model',
					'values'=>$fields)
				)
			);

			if ($ret_id==1){
				$this->addModel(new ModelVars(
					array('id'=>'LastIds',
						'values'=>array(new Field('id',DT_STRING,array('value'=>$ids_ar['id'])))
					)
				));
			}
			$link->query('COMMIT');
		}
		catch(Exception $e){
			$link->query('ROLLBACK');
			throw $e;
		}
		
		if ($ret_id==1){
			return $ids_ar;		
		}
	}

	public function update($pm){
		$p = new ParamsSQL($pm,$this->getDbLink());
		$p->setValidated("old_id");
		
		if ($pm->paramExists(self::PARAM_VIEW)){			
			$p->setValidated("view_id");			
		}
	
		$link = $this->getDbLinkMaster();
		//throw new Exception("!!!");
		$link->query('BEGIN');
		try{							
			$model_id = $this->getUpdateModelId();

			if (!isset($model_id)){
				throw new Exception(self::ER_NO_INSERT_MODEL);
			}
			
			$model = new $model_id($link);
			$data_tb = $model->getTableName();
			
			$this->modelUpdate($model);

			if ($pm->paramExists(self::PARAM_VIEW)){
			
				$link->query(sprintf("SELECT %s_before_write(%s,%d)",
					$data_tb,
					$p->getDbVal('view_id'),
					$p->getDbVal('old_id')
				));				
			}

			if ($this->getProcessable()){
				$this->processDoc($data_tb,$p->getDbVal('old_id'));
			}

			$link->query('COMMIT');
		}
		catch(Exception $e){
			$link->query('ROLLBACK');
			throw $e;
		}		
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

