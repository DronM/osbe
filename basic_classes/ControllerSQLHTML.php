<?php
require_once(FRAME_WORK_PATH.'basic_classes/ControllerSQL.php');
require_once(FRAME_WORK_PATH.'basic_classes/ViewHTML.php');
/*
ф
*/
class ControllerSQLHTML extends ControllerSQL{
	
	public function __construct(){
		parent::__construct();
	}
	protected function setStateVars(ViewHTML $view){
		$vars = $view->getVarModel();
		$vars->insert();
		$view->setVarValue('author',META_AUTHOR);
		$view->setVarValue('title','Controller:'.$this->getId());
		$view->setVarValue('description',$this->getId());
		$view->setVarValue('keywords',$this->getId());
	}
	protected function write($viewClassId,$viewId){
		$view = new $viewClassId($viewId);
		$this->setStateVars($view);
		$view->write($this->getModels());
	}

}
?>