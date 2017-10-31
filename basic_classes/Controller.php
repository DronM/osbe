<?php
require_once(FRAME_WORK_PATH.'basic_classes/PublicMethod.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelServResponse.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelTemplate.php');

class Controller {
	const ER_PUBLIC_METH_NOT_FOUND = 'Метод "%s" класса "%s" не найден.';
	
	/*All open methods of a Controller
	array of PublicMethod objects
	*/
	protected $publicMethods;
	
	/*All models for client output
	array of Model objects and its extended classes
	*/	
	private $models;
	
	/*
		View id to show by default
		object of View class and its extended classes
	*/
	private $defaultView;
	
	/*
		id of the controller
	*/
	private $id;
	
	/*
		Protocole
		TRUE - if client does not mantain state - html
		FALSE - if it does - for AJAX/desktop clients
	*/
	private $statelessClient;
	
	public function __construct(){
		$this->setStatelessClient(FALSE);
		$this->models = array();
		$this->permissions = array();
	}
	
	/*
		For stateless protocoles, sets
		extra variables, which are
		to be sent to client, must be overridden
		in extended classes
	*/
	protected function setStateVars(View $view){
	}
	
	/*
		models operations: add/get
	*/
	public function addModel($model){
		$this->models[$model->getId()] = $model;
	}
	public function getModelById($modelId){
		if (array_key_exists($modelId,$this->models)){
			return $this->models[$modelId];
		}
	}
	
	public function getModels(){
		return new ArrayObject($this->models);
	}

	/*
		Property functions set/get
	*/
	public function getStatelessClient(){
		return $this->statelessClient;
	}
	public function setStatelessClient($statelessClient){
		$this->statelessClient = $statelessClient;
	}
	
	public function getDefaultView(){
		return $this->defaultView;
	}	
	public function setDefaultView($view){
		$this->defaultView = $view;
	}
	public function getId(){
		return (isset($this->id))? $this->id:get_class($this);
	}	
	public function setId($id){
		$this->id = $id;
	}
	
	/*
	************** Public Methods *************************
	*/
	
	/* returns TRUE/FALSE if public
	method $meth_name exists in the controller
	*/
	private function publicMethodExists($methId){
		return (is_array($this->publicMethods) && array_key_exists($methId, $this->publicMethods));
	}
	
	/*
		Checks for public method, returns TRUE if any,
		raises exception if it does not exist
	*/
	public function checkPublicMethod($methId){
		if (!$this->publicMethodExists($methId)){		
			throw new Exception(
				sprintf(Controller::ER_PUBLIC_METH_NOT_FOUND,$methId, get_class($this))
				);
		}
		return TRUE;
	}
	
	/*Adds a new public method to the controller*/
	public function addPublicMethod(PublicMethod $method){
		$this->publicMethods[$method->getId()] = $method;
	}
	
	/*Returns public method by its name*/
	public function getPublicMethod($methodId){
		if ($this->checkPublicMethod($methodId))
			return $this->publicMethods[$methodId];
	}
	
	/*Returns public method iterator*/
	public function getPublicMethodIterator(){
		$arrayobject = new ArrayObject($this->publicMethods);
		return $arrayobject->getIterator();	
	}
	//************** Public Methods *************************	
		
	/* Output function
	*/
	public function write($viewClassId,$viewId,$errorCode=NULL){
		$view = new $viewClassId($viewId);
		if ($this->getStatelessClient()){
			$this->setStateVars($view);
		}
		
		/* if template is requested it is returned with any method*/
		if (defined('PARAM_TEMPLATE') && isset($_REQUEST[PARAM_TEMPLATE])){
			$tmpl = $_REQUEST[PARAM_TEMPLATE]; 
			if (
			(isset($_SESSION['role_id']) && file_exists($file = USER_TMPL_PATH. $tmpl.'.'.$_SESSION['role_id']. '.html') )
			|| (file_exists($file = USER_TMPL_PATH. $tmpl. '.html') )
			)
			{
				$text = file_get_contents($file);
				if (mb_detect_encoding($text,"UTF-8,iso-8859-1",TRUE)!="UTF-8" ){
					$text = iconv("iso-8859-1","UTF-8",$text);
				}
				
				$this->addModel(new ModelTemplate($tmpl,$text));
			}
		}		
		
		$m = $this->getModels();
		//throw new Exception("@@er_code=".$errorCode);	
		$view->write($m,$errorCode);
	}
	
	/**
	 * Runs a clients public method
	 * and outputs the result
	 * @returns {boolean} if TRUE - headers have been sent, need nothing else. File download!!!,else - standart output
	 */
	public function runPablicMethod($methId,array $paramsArray){
		//To Do controller cashing!!!		
		$resp = new ModelServResponse();				
		$this->addModel($resp);		
		if (!is_null($methId)){
			try{	
				$pm = $this->getPublicMethod($methId);
				$pm->setValues($paramsArray);
				return ($this->$methId($pm)===TRUE);
			}
			catch (Exception $e){
				//ошибки postgre
				$em = str_replace('ОШИБКА: ','',$e->getMessage());				
				$ar = explode('@',$em);
				$er_code=(count($ar)>1)? $ar[1]:1;
				$resp->result = $er_code;
				if (count($ar)){
					$resp->descr = htmlspecialchars($ar[0]);	
				}
				
				//$resp->result = 1;
				//$resp->descr = htmlspecialchars($e->getMessage());
			}
		}
	}
	
	/*
		Copies public method parameters to a given
		model parameters
	*/
	protected function methodParamsToModel($pm,Model $model){
		$OLD_FIELD_PREF = 'old_';
		$OLD_FIELD_PREF_LEN = 4;
		$params = $pm->getParamIterator();		
		while($params->valid()) {
			$param = $params->current();			
			$id = $param->getId();
			if (substr($id,0,$OLD_FIELD_PREF_LEN)==$OLD_FIELD_PREF){
				$id = substr($id,$OLD_FIELD_PREF_LEN,strlen($id)-$OLD_FIELD_PREF_LEN);
				if ($model->fieldExists($id)){
					//echo 'Setting old value to '.$param->getValue();
					$model->getFieldById($id)->setOldValue($param->getValue());
				}				
			}
			else if ($model->fieldExists($id)){				
				$model->getFieldById($id)->setValue($param->getValue());
			}
			else if ($model->lookUpFieldExists($id)){
				$look_up_field = $model->getLookUpFieldById($id);
				$look_up_field->setLookUpIdValue($param->getValue());
				//var_dump($look_up_field);
			}
			
			$params->next();
		}
	}
}
?>
