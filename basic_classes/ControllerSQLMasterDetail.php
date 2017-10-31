<?php
require_once(FRAME_WORK_PATH.'basic_classes/ControllerSQL.php');
require_once(FRAME_WORK_PATH.'basic_classes/Model.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelOrderSQL.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelLimitSQL.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelWhereSQL.php');

/*
ф
*/
class ControllerSQLMasterDetail extends ControllerSQL{
	const METH_GET_DETAILS = 'get_details';
	public $detailModelIds;
	
	public function __construct(){
		parent::__construct();
	}
	public function addDetailModelId($id){
		$this->detailModelIds[$id] = $id;
	}
	public function detailModelExists($id){
		return array_key_exists($this->detailModelIds,$id);
	}
	public function getDetailModelById($id){
		return $this->detailModelIds[$id];
	}
	
	public function getDetails($pm){
		$list_model_id = $this->getListModelId();
		$list_model = new $list_model_id($this->getDbLink());
		$fields = $list_model->getFieldIterator();
		$keys = array();
		while($fields->valid()) {
			if ($fields->current()->getPrimaryKey()){
				array_push($keys,$fields->current()->getId());
			}
			$fields->next();
		}
		$details = $this->detailParams($pm);
		if ($details){
			foreach ($details as $det_id){				
				throw new Exception('det_id='.$det_id);
				if ($this->detailModelExists($det_id)){
					
					$model_class = $this->getDetailModelById($det_id);
					$model = new $model_class($this->getDbLink());
					$order = new ModelOrderSQL();
					$order->addField($model->getFieldById('line_no'));
					$where = new ModelWhereSQL();
					foreach ($keys as $key){
						$id = "master_".$key;
						$where->addField($model->getFieldById($id));
						$model->getFieldById($id)->setValue(
							$pm->getParamValue($key));
					}
					$model->select(false,$where,$order,
						null,null,null,null,
						null,TRUE);
					//
					$this->addModel($model);
					
				}
			}			
		}
	}
	
	public function get_details(){
		$pm = $this->getPublicMethod(ControllerSQLMasterDetail::METH_GET_DETAILS);
		$this->getDetails($pm);	
	}
	public function get_list(){
		parent::get_list();
		$pm = $this->getPublicMethod(ControllerDb::METH_GET_LIST);
		$this->getDetails($pm);
	}
	public function get_object(){
		parent::get_object();
		$pm = $this->getPublicMethod(ControllerDb::METH_GET_OBJECT);
		$this->getDetails($pm);
	}
	public function detailParams($pm){
		$details = null;
		$val = $pm->getParamValue('details');
		if (isset($val)){
			$details = explode(',',$val);
		}
		return $details;
	}
	
}
?>