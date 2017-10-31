<?php
require_once(FRAME_WORK_PATH.'basic_classes/ControllerDb.php');
require_once(FRAME_WORK_PATH.'basic_classes/Model.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelSQL.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelOrderSQL.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelLimitSQL.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelWhereSQL.php');
require_once(FRAME_WORK_PATH.'basic_classes/VariantStorage.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtString.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelVars.php');
require_once(FRAME_WORK_PATH.'basic_classes/ParamsSQL.php');

/* data base support*/
//require_once("DbPg.php");
//require_once(FRAME_WORK_PATH."db/db_mysql.php");
/*
ф
*/
class ControllerSQL extends ControllerDb{
	
	private $extParams;
	
	public function __construct($dbLinkMaster=NULL,$dbLink=NULL){
		parent::__construct($dbLinkMaster,$dbLink);
	}
	public function getDbLink(){
		$dbLink = parent::getDbLink();
		if (!isset($dbLink)){
			$dbLink = new DB_Sql();
			$dbLink->appname = APP_NAME;
			$dbLink->technicalemail = TECH_EMAIL;
			$dbLink->reporterror = DEBUG;
			$dbLink->database	= DB_NAME;			
			$dbLink->connect(DB_SERVER,DB_USER,DB_PASSWORD);		
			$this->setDbLink($dbLink);
		}
		return $dbLink;
	}
	public function getDbLinkMaster(){
		$dbLinkMaster = parent::getDbLinkMaster();
		if (!isset($dbLinkMaster)){
			if (DB_SERVER_MASTER!=DB_SERVER){
				$dbLinkMaster = new DB_Sql();
				$dbLinkMaster->appname = APP_NAME;
				$dbLinkMaster->technicalemail = TECH_EMAIL;
				$dbLinkMaster->reporterror = DEBUG;
				$dbLinkMaster->database	= DB_NAME;			
				$dbLinkMaster->connect(DB_SERVER_MASTER,DB_USER,DB_PASSWORD);		
				$this->setDbLinkMaster($dbLinkMaster);
			}
			else{
				$dbLinkMaster = $this->getDbLink();
			}
		}
		return $dbLinkMaster;
	}
	
	/*
	*/
	public function modelGetList($model,$pm=null){		
		$this->beforeSelect();
		if (is_null($pm)){
			$pm = $this->getPublicMethod(ControllerDb::METH_GET_LIST);		
		}
		$from = null; $count = null;
		$limit = $this->limitFromParams($pm,$from,$count);
		$calc_total = ($count>0);
		if ($from){
			$model->setListFrom($from);
		}
		if ($count){
			$model->setRowsPerPage($count);
		}		
		$order = $this->orderFromParams($pm,$model);
		$where = $this->conditionFromParams($pm,$model);
		$fields = $this->fieldsFromParams($pm);		
		$grp_fields = $this->grpFieldsFromParams($pm);		
		$agg_fields = $this->aggFieldsFromParams($pm);		
			
		$browse_mode = $pm->getParamValue('browse_mode');
		if (!isset($browse_mode)){
			$browse_mode = BROWSE_MODE_VIEW;
		}
		$model->setBrowseMode($browse_mode);
			
		$is_insert = ($browse_mode==BROWSE_MODE_INSERT);
		$model->select($is_insert,$where,$order,
			$limit,$fields,$grp_fields,$agg_fields,
			$calc_total,TRUE);
		//
		$this->addModel($model);
		$this->afterSelect();	
	}
	
	protected function methodParamsToWhere(&$where,$pm,$model){
		$params = $pm->getParamIterator();		
		while($params->valid()) {
			$param = $params->current();
			$id = $param->getId();
			if ($model->fieldExists($id)){
				$field = $model->getFieldById($id);
				$field->setValue($param->getValue());
				$where->addField($field);
			}			
			$params->next();
		}	
	}
	
	public function modelGetObject($model,$pm=NULL){
		$this->beforeSelect();
		$model->setDefaultModelOrder(NULL);
		if (is_null($pm)){
			//$pm = $this->getPublicMethod(ControllerDb::METH_GET_LIST);		
			$pm = $this->getPublicMethod(ControllerDb::METH_GET_OBJECT);
		}		
		
		//$this->methodParamsToModel($pm,$model);
		$where = new ModelWhereSQL();
		$this->methodParamsToWhere($where,$pm,$model);
		
		/*
		$browse_mode = $pm->getParamById('browse_mode')->getValue();
		if (!isset($browse_mode)){
			$browse_mode = BROWSE_MODE_VIEW;
		}		
		$this->browseMode = $browse_mode;
		*/
		
		$limit = new ModelLimitSQL(1);
		//($browse_mode==BROWSE_MODE_INSERT)
		$model->select(
				FALSE,
				$where,NULL,$limit,NULL,NULL,NULL,NULL,true);
		//
		$this->addModel($model);
		
		$this->afterSelect();		
	}
	
	public function addNewModel($query,$modelId=NULL,$toXML=TRUE){
		if (!isset($modelId)){
			$modelId = str_replace('_Controller','',$this->getId()).'_Model';
		}
		$model = new ModelSQL($this->getDbLink(),array('id'=>$modelId));
		$model->query($query,$toXML);
		$this->addModel($model);
	}
	
	public function conditionFromParams($pm,$model){
		$where = null;
		$val = $pm->getParamValue('cond_fields');
		if (isset($val) && $val!=''){
			
			//ToDo flexible
			$field_sep = $pm->getParamValue('field_sep');			
			$field_sep = ($field_sep)? $field_sep:',';
			$condFields = explode($field_sep,$val);
			
			$cnt = count($condFields);						
			
			if ($cnt>0){				
				$val = $pm->getParamValue('cond_sgns');
				$condSgns = (isset($val))? explode($field_sep,$val):array();
				
				$val = $pm->getParamValue('cond_vals');				
				
				$condVals = (isset($val))? explode($field_sep,$val):array();				
				$val = $pm->getParamValue('cond_ic');
				$condInsen = (isset($val))? explode($field_sep,$val):array();
				
				$sgn_keys_ar = explode(',',COND_SIGN_KEYS);
				$sgn_ar = explode(',',COND_SIGNS);
				if (count($condVals)!=$cnt){
					throw new Exception('Количество значений условий не совпадает с количеством полей! '.count($condVals).'<>'.$cnt);
				}
				
				//ToDo flexible
				$COND_FIELD_MULTY_VAL_SEP = ';';
				
				$where = new ModelWhereSQL();
				for ($i=0;$i<$cnt;$i++){					
					if (count($condSgns)>$i){
						$ind = array_search($condSgns[$i],$sgn_keys_ar);
					}
					else{
						//default param
						$ind = array_search('e',$sgn_keys_ar);
					}
					if ($ind>=0){
											
						if ($sgn_ar[$ind]=='LIKE'){
							//soft validation: all values considered strings
							$ext_class = 'FieldExtString';
							$field = new FieldSQLString($this->getDbLink(),null,null,$condFields[$i]);
						}
						else{
							$field = clone $model->getFieldById($condFields[$i]);
							$ext_class = str_replace('SQL','Ext',get_class($field));													
						}
						$ext_field = new $ext_class($field->getId());
					
						if ($sgn_ar[$ind]=='IN' || $sgn_ar[$ind]=='=ANY' || $sgn_ar[$ind]=='&&'){
							$condFiledVals = explode($COND_FIELD_MULTY_VAL_SEP,$condVals[$i]);
							$condFiledValsStr = '';
							for ($k=0;$k<count($condFiledVals);$k++){
								//validation
								$ext_field->setValue($condFiledVals[$k]);
								$field->setValue($ext_field->getValue());
							
								$condFiledValsStr.=($condFiledValsStr=='')? '':',';
								$condFiledValsStr.=$field->getValueForDb();
							}
							
							if ($sgn_ar[$ind]=='IN'){
								$field->setSQLExpression(sprintf('(%s)',$condFiledValsStr));
							}
							else if ($sgn_ar[$ind]=='=ANY'){
								$field->setSQLExpression(sprintf('(ARRAY[%s])',$condFiledValsStr));
							}
							else if ($sgn_ar[$ind]=='&&'){
								$field->setSQLExpression(sprintf('ARRAY[%s]',$condFiledValsStr));
							}
							
							$ic = FALSE;
						}
						else{
							//validation
							$ext_field->setValue($condVals[$i]);
							$field->setValue($ext_field->getValue());
							//echo 'ind='.$i.' val='.$ext_field->getValue();
						
							$ic = (count($condInsen)>$i)? ($condInsen[$i]=='1'):FALSE;
							/*
							if (count($condInsen)>$i){
								$ic = ($condInsen[$i]=='1');
							}
							else{
								$ic = false;
							}
							*/
						}						
						$where->addField($field, $sgn_ar[$ind], NULL, $ic);
						//throw new Exception('val='.$where->getSQL());
					}
				}
			}
		}		
		return $where;
	}
	
	public function orderFromParams($pm,$model){
		$order = null;
		$val = $pm->getParamValue('ord_fields');
		if (isset($val)){
			$ordFields = explode(',',$val);
			if (count($ordFields)>0){
				$order = new ModelOrderSQL();
				$val = $pm->getParamValue('ord_directs');
				$ordFieldsDirects = NULL;
				if (isset($val)){
					$ordFieldsDirects = explode(',',$val);
				}
				for ($i=0;$i<count($ordFields);$i++){
					$dir = (is_null($ordFieldsDirects))? NULL:(($i<count($ordFieldsDirects))? $ordFieldsDirects[$i]:NULL);
					$field = $model->getFieldById($ordFields[$i]);					
					$order->addField($field,$dir);
				}
			}
		}
		return $order;
	}
	public function limitFromParams($pm,&$from,&$count){
		$limit = null;
		$count = $pm->getParamValue('count');
		$from = $pm->getParamValue('from');
		if (isset($from) || isset($count)){
			$limit = new ModelLimitSQL($count,$from);
		}
		return $limit;
	}
	public function fieldsFromParams($pm){
		$fields = null;
		$val = $pm->getParamValue('fields');
		if (isset($val)){
			$fields = explode(',',$val);
		}
		return $fields;
	}
	public function grpFieldsFromParams($pm){
		$fields = null;
		$val = $pm->getParamValue('grp_fields');
		if (isset($val)){
			$fields = explode(',',$val);
		}
		return $fields;
	}
	public function aggFieldsFromParams($pm){
		$fields = null;
		$val = $pm->getParamValue('agg_fields');
		if (isset($val)){
			$fields = explode(',',$val);
		}
		return $fields;
	}
	public function aggTypesFromParams($pm){
		$fields = null;
		$val = $pm->getParamValue('agg_types');
		if (isset($val)){
			$fields = explode(',',$val);
		}
		return $fields;
	}
	
	public function write($viewClassId,$viewId,$errorCode=NULL){
		if (isset($_REQUEST['t'])){
			$stvar = VariantStorage::restore($_REQUEST['t']);
			if (is_null($stvar)){
				$stvar = ModelSQL::defStorageForTemplate($this->getDbLink(),$_REQUEST['t']);
			}
			if (is_array($stvar) && count(is_array($stvar)==1)){
				$this->addModel(new ModelVars(
					array('name'=>'Vars',
						'id'=>'VariantStorage_Model',
						'values'=>array(
							new Field('filter_data',DT_STRING,
								array('value'=>$stvar['filter_data'])),
							new Field('col_visib_data',DT_STRING,
								array('value'=>$stvar['col_visib_data'])),
							new Field('col_order_data',DT_STRING,
								array('value'=>$stvar['col_order_data']))
						)
					)
				));					
			}
			
			/*
			$tmpl_for_db = "";
			FieldSQLString::formatForDb($this->getDbLink(),$_REQUEST['t'],$tmpl_for_db);
		
			$this->addNewModel(sprintf(
			"SELECT *
			FROM variant_storages
			WHERE user_id=%d AND storage_name=%s AND default_variant=TRUE",
			(isset($_SESSION['user_id']))? $_SESSION['user_id']:0,
			$tmpl_for_db
			),
			'VariantStorage_Model'
			);
			*/
			
			/*
			$this->addNewModel(sprintf("SELECT
				param AS paramId,
				param_type,
				val
			FROM teplate_params_get_list('%s'::text, %d)",
			$_REQUEST['t'],
			(isset($_SESSION['user_id']))? $_SESSION['user_id']:0
			),
			'TemplateParamValList_Model'
			);
			*/			
		}	
		parent::write($viewClassId,$viewId,$errorCode);
	}

	private function assignParams($pm){
		if (is_null($this->extParams) || $pm!=$this->extParams->getPublicMethod()){
			$this->extParams = new ParamsSQL($pm,$this->getDbLink());
			$this->extParams->addAll();
		}
	}
	
	public function getExtVal($pm,$id){
		$this->assignParams($pm);
		return $this->extParams->getVal($id);
	}
	public function getExtDbVal($pm,$id){
		$this->assignParams($pm);
		return $this->extParams->getDbVal($id);
	}
	
}
?>
