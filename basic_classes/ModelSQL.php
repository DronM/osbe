<?phprequire_once(FRAME_WORK_PATH.'basic_classes/Model.php');require_once(FRAME_WORK_PATH.'basic_classes/GlobalFilter.php');require_once(FRAME_WORK_PATH.'basic_classes/ModelWhereSQL.php');require_once(FRAME_WORK_PATH.'basic_classes/ModelLimitSQL.php');require_once(FRAME_WORK_PATH.'basic_classes/ModelJoinSQL.php');require_once(FRAME_WORK_PATH.'basic_classes/ModelGroupBySQL.php');require_once(FRAME_WORK_PATH.'basic_classes/VariantStorage.php');require_once(FRAME_WORK_PATH.'basic_classes/FieldExtString.php');class ModelSQL extends Model{	const SQL_INSERT = 'INSERT INTO %s (%s) VALUES (%s)';	const SQL_DELETE = 'DELETE FROM %s WHERE %s';	const SQL_UPDATE = 'UPDATE %s SET %s WHERE %s';	const SQL_SELECT = 'SELECT %s FROM %s';	const SQL_COMPLETE = "SELECT * FROM %s";	const SQL_TOT_COUNT = 'SELECT COUNT(*) AS total_count FROM %s';	const SQL_SELECT_INSERT = '(SELECT %s FROM %s.%s)';	const SQL_SELECT_XML = "SELECT query_to_xml('%s',true,true,'') AS xml";		const DEF_COMPLETE_COUNT=5;		const DEF_COUNT_PER_PAGE = 500;		private $dbLink;		private $tableName;//string	private $dbName;//string		protected $queryId;			protected $rowCount=0;		private $selectQueryText;	private $selectQueryPrefix;		private $lookUpFields;		private $defaultModelOrder;		private $limitConstant;		private $aggFunctions;		private $lastRowSelectOnInit;			/*	********* Public *******************************	*/	public function __construct($dbLink,$options=NULL){		parent::__construct($options);		$this->setDbLink($dbLink);		$lookUpFields= array();					}		public function addField($field){		parent::addField($field);		if ($field->getFieldType()==FT_LOOK_UP){			$keys = $field->getLookUpKeys();			$pref = $field->getDbName().'_'.					$field->getTableName().'_';			foreach ($keys as $key=>$kk){				$this->lookUpFields[$pref.$key] = $field;			}		}	}		/*$func array of		alias		expr	*/	public function addAggFunction($func){		if (!isset($this->aggFunctions)){			$this->aggFunctions = array();		}		array_push($this->aggFunctions,$func);	}		public function getLimitConstant(){		return $this->limitConstant;	}	public function setLimitConstant($v){		$this->limitConstant = $v;	}	public function getLastRowSelectOnInit(){		return $this->lastRowSelectOnInit;	}	public function setLastRowSelectOnInit($v){		$this->lastRowSelectOnInit = $v;	}		public function lookUpFieldExists($id){		//echo 'ModelSQL lookUpFieldExists id='.$id.' exists='.is_array($this->lookUpFields);		return (is_array($this->lookUpFields) && array_key_exists($id,$this->lookUpFields));	}	public function getLookUpFieldById($fieldId){		return $this->lookUpFields[$fieldId];	}		public function getDbName(){		return (isset($this->dbName))? $this->dbName:DB_NAME;	}	public function setDbName($dbName){		$this->dbName = $dbName;	}	public function getSelectQueryText(){		return $this->selectQueryText;	}	public function setSelectQueryText($selectQueryText){		$this->selectQueryText = $selectQueryText;	}	public function getSelectQueryPrefix(){		return $this->selectQueryPrefix;	}	public function setSelectQueryPrefix($selectQueryPrefix){		$this->selectQueryPrefix = $selectQueryPrefix;	}		public function getTableName(){		return $this->tableName;	}	public function setTableName($table_name){		$this->tableName = $table_name;	}		public function getDbLink(){		return $this->dbLink;	}	public function setDbLink($dbLink){		$this->dbLink = $dbLink;	}	public function getDefaultModelOrder(){		return $this->defaultModelOrder;	}	public function setDefaultModelOrder($defaultModelOrder){		$this->defaultModelOrder = $defaultModelOrder;	}			public function getFieldById($fieldId){		if ($this->checkField($fieldId)){			return $this->fields[$fieldId];		}	}		public function getFieldIterator(){		$arrayobject = new ArrayObject($this->fields);		return $arrayobject->getIterator();	}		public function getTableFullPath(){		return $this->getTableName();		/*		$res = $this->getDbName();		$res.= (!isset($res)||$res=='')? '':'.';		$res.= $this->getTableName();		return $res;		*/	}		public function getInsertQuery($needId=FALSE){		$this->queryId = 0;		$field_str = '';		$value_str = '';		$ids_list = '';		//var_dump($this->fields);				//global filter hash values		$global_filter_vals = array();		$globalFilter = GlobalFilter::get($this->getId());				if ($globalFilter){			$fields = $globalFilter->getFieldIterator();								while($fields->valid()){				$field = $fields->current();				$field = $field['field'];				$global_filter_vals[$field->getId()] = $field->getValue();				$fields->next();			}		}		$fields = $this->getFieldIterator();		while($fields->valid()) {			$field = $fields->current();			$field_data_type = $field->getFieldType();			$needed_types = ($field_data_type==FT_DATA || $field_data_type==FT_LOOK_UP);			$is_primary = $field->getPrimaryKey();			$skeep = (!$needed_types				|| $field->getReadOnly()								|| ($is_primary && $field->getAutoInc())				);							if ($needId && $is_primary){				$ids_list.=($ids_list=='')? '':',';				$ids_list.=$field->getSQLNoAlias();			}							if (!$skeep){				$field_str.= ($field_str=='')? '':',';								if ($field_data_type==FT_DATA){					//check on global filter					$field_id = $field->getId();					if (array_key_exists($field_id,$global_filter_vals)					&& $global_filter_vals[$field_id]!=$field->getValue()){												$field->setValue($global_filter_vals[$field_id]);					}					$field_str.= $field->getSQLNoAlias();				}				else{					$field_str.= $field->getSQLLookUpNoAlias();				}				/*				if ($field->getId()=='create_dt'){					throw new Exception("value=".$field->getValueForDb());				}				*/				$value_str.= ($value_str=='')? '':',';				$value_str.= $field->getValueForDb();			}			$fields->next();		}		$q = sprintf(ModelSQL::SQL_INSERT,			$this->getTableFullPath(),			$field_str,$value_str);		if ($needId){			$q.=' returning '.$ids_list;		}		//throw new Exception('ModelSQL insert q='.$q);		return $q;	}	public function insert($needId=FALSE){		$q = $this->getInsertQuery($needId);		//throw new Exception($q);		$link = $this->getDbLink();		$this->queryId = $link->query($q);		if ($needId){			$ret = $link->fetch_array($this->queryId);		}		else{			$ret = NULL;		}		return $ret;			}		public function getUpdateQuery(){		$this->queryId = 0;		$cond_str = '';		$assigne_str = '';				$global_filter_vals = array();				$globalFilter = GlobalFilter::get($this->getId());				if ($globalFilter){			$fields = $globalFilter->getFieldIterator();								while($fields->valid()){				$field = $fields->current();				$field = $field['field'];				$global_filter_vals[$field->getId()] = $field->getValue();				$fields->next();			}		}				$fields = $this->getFieldIterator();		while($fields->valid()) {			$field = $fields->current();			if ($field->getFieldType()==FT_DATA){				//echo ' '.$field->getId()."=".$field->getValue().' = '.$field->getOldValue();				if (!is_null($field->getValue())){					$field_id = $field->getId();					if (array_key_exists($field_id,$global_filter_vals)					&& $global_filter_vals[$field_id]!=$field->getValue()){						$field->setValue($global_filter_vals[$field_id]);					}					$assigne_str.= ($assigne_str=="")? "":",";					$assigne_str.= $field->getSQLAssigne();				}				if (!is_null($field->getOldValue())){					$cond_str.= ($cond_str=='')? '':' AND ';					$cond_str.= '('.$field->getSQLAssigneOldValue().')';				}			}			else if ($field->getFieldType()==FT_LOOK_UP){				if (!is_null($field->getLookUpIdValue())){					$assigne_str.= ($assigne_str=="")? "":",";					$assigne_str.= $field->getSQLLookUpAssigne();				}			}			$fields->next();		}		if (isset($globalFilter)){			$cond_str.= ($cond_str=='')? '':' AND ';			$cond_str.=$globalFilter->getSQL(($cond_str==''));		}		if ($assigne_str==''){			return '';		}		return sprintf(ModelSQL::SQL_UPDATE,			$this->getTableFullPath(),			$assigne_str,$cond_str			);			}		public function update(){		$q = $this->getUpdateQuery();				//throw new Exception($q);		if (strlen($q)){			$this->getDbLink()->query($q);			}	}		public function delete(){		$this->queryId = 0;		$cond_str = '';		$fields = $this->getFieldIterator();		while($fields->valid()) {			$field = $fields->current();			if ($field->getFieldType()==FT_DATA				&& !is_null($field->getValue())){				$cond_str.= ($cond_str=='')? '':' AND ';				$cond_str.= '('.$field->getSQLAssigne().')';			}			$fields->next();		}		$globalFilter = GlobalFilter::get($this->getId());		if (isset($globalFilter)){			$cond_str.=($cond_str=='')? '':' AND ';			$cond_str.=$globalFilter->getSQL(($cond_str==''));		}				$q = sprintf(ModelSQL::SQL_DELETE,			$this->getTableFullPath(),			$cond_str			);		//throw new Exception('ModelSQL delet q='.$q);		$this->getDbLink()->query("		do $$		BEGIN		".$q.";		EXCEPTION			WHEN SQLSTATE '23503' THEN			RAISE '".ERR_DELETE_CONSTR_VIOL."';		END;				$$ language 'plpgsql';				");		/*		try{			$qid = $this->getDbLink()->query($q);			$this->getDbLink()->query('COMMIT');		}		catch (Exception $e){			$this->getDbLink()->query('ROLLBACK');			throw new Exception(pg_last_error($qid).' 1='.$e->getMessage().ERR_DELETE_CONSTR_VIOL);		}				*/	}		public function query($query,$toXML=TRUE){		if ($toXML){			$query = sprintf(				ModelSQL::SQL_SELECT_XML,str_replace("'","''",$query));		}		$link = $this->getDbLink();		$this->queryId = $link->query($query);		$this->rowCount = $link->num_rows($this->queryId);		//throw new Exception('query='.$query);		$this->setRowBOF();		}		public function complete($count=null,$ic=FALSE,$mid=FALSE,$toXML=NULL){		if (!isset($count)){			$count = ModelSQL::DEF_COMPLETE_COUNT;		}			$this->queryId = 0;		$where_str = '';		$limit = new ModelLimitSQL($count);		$fields = $this->getFieldIterator();		while($fields->valid()) {			$field = $fields->current();			//var_dump($field);			if ($field->getFieldType()==FT_DATA				&& !is_null($field->getValue())){				$where_str.=($where_str=='')? '':' AND ';				if ($ic){					$where_str.="lower(".$field->getSQLNoAlias()."::text) LIKE ";					if ($mid){						$where_str.="lower('%".$field->getValue()."%')";					}					else{						$where_str.="lower('".$field->getValue()."%')";					}				}				else{					$where_str.=$field->getSQLNoAlias()." LIKE ";					if ($mid){						$where_str.="'%".$field->getValue()."%'";					}					else{						$where_str.="'".$field->getValue()."%'";					}								}			}			$fields->next();		}		$globalFilter = GlobalFilter::get($this->getId());		if (isset($globalFilter)){			$where_str.=$globalFilter->getSQL(($cond_str==''));		}		$q = sprintf(ModelSQL::SQL_COMPLETE,			$this->getTableFullPath()			);		if (strlen($where_str)){			$q.=' WHERE '.$where_str;		}		$q.=' '.$limit->getSQL();				//throw new Exception($q);		$this->query($q,$toXML);	}		public static function defStorageForTemplate($link,$t){		$tmpl_for_db = "";		FieldSQLString::formatForDb($link,$t,$tmpl_for_db);		$varq = sprintf(		"SELECT			filter_data,			col_visib_data,			col_order_data		FROM variant_storages		WHERE user_id=%d AND storage_name=%s AND default_variant=TRUE		",		(isset($_SESSION['user_id']))? $_SESSION['user_id']:0,		$tmpl_for_db		);						$stvar = $link->query_first($varq);		VariantStorage::save($t,$stvar);					return $stvar;	}		public function addStoredFilter(&$modelWhere){			if (defined('PARAM_TEMPLATE') && isset($_REQUEST[PARAM_TEMPLATE])){			$stvar = VariantStorage::restore($_REQUEST[PARAM_TEMPLATE]);					if (is_null($stvar)){				$stvar = self::defStorageForTemplate($this->getDbLink(),$_REQUEST[PARAM_TEMPLATE]);				/*				$tmpl_for_db = "";				FieldSQLString::formatForDb($this->getDbLink(),$_REQUEST[PARAM_TEMPLATE],$tmpl_for_db);						$varq = sprintf(				"SELECT					filter_data,					col_visib_data,					col_order_data				FROM variant_storages				WHERE user_id=%d AND storage_name=%s AND default_variant=TRUE				",				(isset($_SESSION['user_id']))? $_SESSION['user_id']:0,				$tmpl_for_db				);								$stvar = $this->getDbLink()->query_first($varq);				VariantStorage::save($_REQUEST[PARAM_TEMPLATE],$stvar);				*/			}			//throw new Exception("addStoredFilter Str=".$stvar['filter_data']);				if ($stvar['filter_data']){				if (is_null($modelWhere)){					$modelWhere = new ModelWhereSQL();				}				VariantStorage::applyFilters($stvar['filter_data'],$this,$modelWhere);			}			//throw new Exception("WHERE=".$modelWhere->getSQL());			//$calcTotalCount = TRUE;		}		}		public function addGlobalFilter(&$modelWhere){		$globalFilter = GlobalFilter::get($this->getId());					if (isset($globalFilter)){//			throw new Exception('globalFilter');			if (is_null($modelWhere)){				$modelWhere = $globalFilter;			}			else{				$fields = $globalFilter->getFieldIterator();									while($fields->valid()){					$field = $fields->current();					$w_fields = $modelWhere->getFieldIterator();					$f_found = FALSE;											while ($w_fields->valid()){													$w_field = $w_fields->current();													if ($w_field['field']->getId()==$field['field']->getId()){							//все настройки из GlobalFilter							$f_found = TRUE;							$w_field['signe'] = $field['signe'];							$w_field['cond'] = $field['cond'];							$w_field['field']->setValue($field['field']->getValue());							break;														}													$w_fields->next();					}											if (!$f_found){						$modelWhere->addField($field['field'],$field['signe'],$field['cond']);					}					$fields->next();				}			}						}		}		protected function updateTotalCount($modelWhere,$modelJoinCount=NULL){		//count always in!!!		$agg_s = 'count(*) AS total_count';		if (isset($this->aggFunctions)){			foreach($this->aggFunctions as $func){				$agg_s.=','.sprintf('%s AS %s',$func['expr'],$func['alias']);									}		}			$tot_count_query = sprintf("SELECT %s FROM %s",			$agg_s,			$this->getTableFullPath()		);		//$tot_count_query = sprintf(ModelSQL::SQL_TOT_COUNT, $this->getTableFullPath());				//necessary joins		if (!is_null($modelJoinCount)){			$tot_count_query.=' '.$modelJoinCount->getSQL();		}		//where condition		if (!is_null($modelWhere)){			$tot_count_query.=' '.$modelWhere->getSQL();		}				//throw new Exception('ModelSQL->tot_count_query='.$tot_count_query);				$tot_count = $this->getDbLink()->query_first($tot_count_query);				if (isset($this->aggFunctions)){			$ind = 0;			foreach($this->aggFunctions as $func){								if (isset($tot_count[$func['alias']])){					$this->aggFunctions[$ind]['val'] = $tot_count[$func['alias']];				}				$ind++;			}		}				//throw new Exception('total=='.$tot_count['total_count']);									$this->setTotalCount($tot_count['total_count']);		}		public function select($insertMode=FALSE,					$modelWhere=NULL,					$modelOrder=NULL,					$modelLimit=NULL,					$fieldArray=NULL,					$grpFieldArray=NULL,					$aggFieldArray=NULL,					$calcTotalCount=NULL,					$toXML=NULL){							$this->queryId = 0;		$query = $this->getSelectQueryText();		$modelJoin = NULL;		$modelJoinCount = NULL;		$modelGroupBy = NULL;				if (!isset($query)){			$fieldsStr = "";			if ($insertMode){				$insertFieldsStr = "";			}			if ($grpFieldArray){				$modelGroupBy = new ModelGroupBySQL();				for ($i=0;$i<count($grpFieldArray);$i++){					$field = $this->getFieldById($grpFieldArray[$i]);					$fieldsStr.=($fieldsStr=="")? "":",";					$fieldsStr.=$field->getSQL();					$modelGroupBy->addField($field);				}				for ($i=0;$i<count($aggFieldArray);$i++){					$field = $this->getFieldById($aggFieldArray[$i]);					$fieldsStr.=($fieldsStr=="")? "":",";					$fieldsStr.=sprintf('SUM(%s) AS "%s"',						$field->getSQLNoAlias(),						$field->getId());				}							}			else{				$fieldsStr = '*';				/*				$fields = $this->getFieldIterator();				while($fields->valid()) {					$field = $fields->current();					$fieldId = $field->getId();					if (!is_null($filterModel)						&&$filterModel->fieldExists($fieldId)){						//global filter						if (is_null($modelWhere)){							$modelWhere = new ModelWhereSQL();						}						$modelWhere->addField(							$filterModel->getFieldById($fieldId));					}					if (						(is_array($fieldArray)						&& array_key_exists($fieldId,$fieldArray))						|| (!is_array($fieldArray))						|| (is_array($fieldArray) && count($fieldArray)==0)						){						$fieldsStr.=($fieldsStr=="")? "":",";						$fieldsStr.=$field->getSQL();						if ($insertMode){							$insertFieldsStr.=($insertFieldsStr=="")? "":",";							$insertFieldsStr.=$field->getSQLDefValue();											}					}					$fields->next();				}				*/									/*					if ($field->getFieldType()==FT_LOOK_UP){						//joins						if (is_null($modelJoin)){							$modelJoin = new ModelJoinSQL();						}						if (!$modelJoin->fieldExists($fieldId)){							$modelJoin->addField($field);						}						$fieldsStr.=','.$field->getSQLLookUp();						if ($insertMode){							$insertFieldsStr.=($insertFieldsStr=="")? "":",";							$insertFieldsStr.=$field->getSQLLookUpDefValue();											}												if ($calcTotalCount							&& !is_null($modelWhere)							&& $modelWhere->fieldExists($fieldId)){							if (!$modelJoinCount->fieldExists($fieldId)){								$modelJoinCount->addField($field);							}						}					}					*/							}						//variant storage filter			$this->addStoredFilter($modelWhere);			$this->addGlobalFilter($modelWhere);						if ($this->getLastRowSelectOnInit() && !isset($modelLimit)){				//Last page!!!				$this->updateTotalCount($modelWhere);							$cnt = $this->getRowsPerPage();				$cnt = ($cnt)? $cnt : self::DEF_COUNT_PER_PAGE;							$this->setListFrom(floor($this->getTotalCount() / $cnt) * $cnt);				//throw new Exception("PerPage=".$this->getRowsPerPage()." cnt=".$this->getTotalCount());							$modelLimit = new ModelLimitSQL($this->getRowsPerPage(), $this->getListFrom());							$calcTotalCount = FALSE;					}								if ($insertMode){				$insertStr = 'SELECT '.$insertFieldsStr.' UNION ALL ';			}			else{				$insertStr = '';			}			$query = $this->getSelectQueryPrefix().					$insertStr.						sprintf(ModelSQL::SQL_SELECT,							$fieldsStr,							$this->getTableFullPath()						);							//joins			if (!is_null($modelJoin))				$query.=$modelJoin->getSQL();						//where condition			if (!is_null($modelWhere)){				$query.=' '.$modelWhere->getSQL();			}			if (!is_null($modelGroupBy)){				$query.=' '.$modelGroupBy->getSQL();			}			//order by			if (!is_null($modelOrder)){				$query.=' '.$modelOrder->getSQL();			}			else if ($order = $this->getDefaultModelOrder()){				$query.=' '.$order->getSQL();			}						//limit			if (!is_null($modelLimit)){				$query.=' '.$modelLimit->getSQL();				$this->setRowsPerPage($modelLimit->getCount());				$this->setListFrom($modelLimit->getFrom());			}			else{				$cnt = $this->getRowsPerPage();				if (!$cnt){					$cnt = self::DEF_COUNT_PER_PAGE;					$calcTotalCount = FALSE;				}				else{					$calcTotalCount = TRUE;				}				$query.=sprintf(' LIMIT %d',$cnt);			}			/*			else if ($this->limitConstant){				$query.=sprintf(' LIMIT (SELECT const_%s_val())',$this->limitConstant);				$calcTotalCount = TRUE;			}			else if ($this->limitCount){				$query.=sprintf(' LIMIT %d',$this->limitCount);				$calcTotalCount = TRUE;			}			*/			//if ($insertMode)				//$query.=')';		}		//throw new Exception($query);		//if ($this->getRowsPerPage() && !$this->getTotalCount()){				if ($calcTotalCount){			$this->updateTotalCount($modelWhere,$modelJoinCount);		}				$this->query($query,$toXML);	}	/*	*/	private function fetchRow(){		if ($ar = $this->getDbLink()->fetch_array($this->queryId)) {			$arrayobject = new ArrayObject($ar);			$ar_it = $arrayobject->getIterator();			while($ar_it->valid()) {				$fieldAlias = $ar_it->key();				if ($this->aliasExists($fieldAlias)){					$field = $this->getFieldByAlias($fieldAlias);					if (isset($field)){						$field->setValue($ar_it->current());						if ($field->getFieldType()==FT_LOOK_UP){							//MUST be an id							$keys = $field->getLookUpKeys();							$ids = '';							$pref = $field->getDbName().'_'.$field->getTableName().'_';							foreach ($keys as $key=>$kk){								if (isset($ar[$pref.$key])){									$ids.=($ids=='')? '':',';									$ids.=$ar[$pref.$key];								}							}							//echo 'ModelSQL->fetchRow() ids='.$ids;							$field->setLookUpIdValue($ids);						}					}				}				$ar_it->next();			}				}	}		public function getRowCount(){		return $this->rowCount;		//$this->getDbLink()->num_rows($this->queryId);	}	public function setRowPos($rowPos){		parent::setRowPos($rowPos);		if ($rowPos>=0){			$this->getDbLink()->data_seek($rowPos, $this->queryId);			$this->fetchRow();		}	}	public function getNextRow(){		$res = parent::getNextRow();		if ($res)			$this->fetchRow();		return $res;	}		public function getRowsPerPage(){				/*if one wants an unlimited model -needs to set rowsPerPage to 0 */				if ($this->rowsPerPage){			return $this->rowsPerPage;		}		else if ($this->limitConstant && isset($_SESSION[$this->limitConstant])){			return $_SESSION[$this->limitConstant]; 		}		else if ($this->limitConstant && !isset($_SESSION[$this->limitConstant])){			$ar = $this->getDbLink()->query_first(sprintf('SELECT const_%s_val() AS val',$this->limitConstant));			$_SESSION[$this->limitConstant] = intval($ar['val']);			return $_SESSION[$this->limitConstant];		}		else{			return 0;		}	}		public function dataToXML($isXMLSelect=FALSE){		$this->setRowBOF();		//echo 'Model->dataToXML ROWPos='.$this->getRowPos();				//agg attributes		$agg_attrs = '';		if (isset($this->aggFunctions)){			foreach($this->aggFunctions as $func){								if (isset($func['val'])){					$agg_attrs.=sprintf(' %s = "%s"',$func['alias'],$func['val']);				}			}				}				$result = sprintf('<%s id="%s" sysModel="%d"		rowsPerPage="%d" listFrom="%d" totalCount="%d"		browseMode="%d" browseId="%s"%s>',		Model::DATA_NODE_NAME,$this->getId(),($this->getSysModel())? '1':'0',		$this->getRowsPerPage(),$this->getListFrom(),$this->getTotalCount(),		$this->getBrowseMode(),($this->getBrowseId())? '1':'0',		$agg_attrs		);		if ($isXMLSelect){			//already got XML data			$result.=$this->getDbLink()->fetch_result($this->queryId,0,0);		}		else{			while ($this->getNextRow()){				//echo 'Model->dataToXML ROWPos='.$this->getRowPos();				$data='';				//$id = '';				$fields = $this->getFieldIterator();				while($fields->valid()) {					$field = $fields->current();					//echo 'Model->dataToXML field id='.$field->getAlias();					$data.= $field->dataToXML();					if ($field->getPrimaryKey()){						//primary key						//$id.=($id=='')?'':',';						//$id.=$field->getValue();					}					$fields->next();				}				/*				$result.= '<'.Model::ROW_NODE_NAME.' id="'.$id.'">';				$result.= $data;				$result.= '</'.Model::ROW_NODE_NAME.'>';				*/				$result.= sprintf('<%s>%s</%s>',					Model::ROW_NODE_NAME,					$data,					Model::ROW_NODE_NAME);			}		}		$result.='</'.Model::DATA_NODE_NAME.'>';		return $result;	}}?>