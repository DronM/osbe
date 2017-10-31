<?php
require_once(FRAME_WORK_PATH.'basic_classes/Controller.php');
class ControllerFileStoreSmall extends Controller{
	private $dbLink;
	private $dbLinkMaster;
	
	/*
		uploads file of a given object and attr
	*/
	private function uploadFile(&$obj,$attr,$ext,$old_ext){
		$filename = $obj->getAttachName($attr);
		$real_filename = $filename.'.'.$ext;
		if ($old_ext && (file_exists($old_file = $filename.'.'.$old_ext))){
			unlink($old_file);
		}		
		return  move_uploaded_file($_FILES[$attr]['tmp_name'], $real_filename);
	}	
	
	private function checkForFile($attr,&$valid_pic_types){
		if ((isset($_FILES[$attr]))
		and (is_uploaded_file($_FILES[$attr]['tmp_name']))){
			$ext =  strtolower(substr($_FILES[$attr]['name'],
				1 + strrpos($_FILES[$attr]['name'], ".")));
			if ((is_array($valid_pic_types)) && (in_array($ext, $valid_pic_types))){
				return $ext;
			}else if (!is_array($valid_pic_types)){
				return $ext;
			}
		}else{
			return false;
		}
	}
	
	public function __construct($dbLinkMaster=NULL,$dbLink=NULL){
		parent::__construct();
		$this->setDbLinkMaster($dbLinkMaster);
		$this->setDbLink($dbLink);
	}
	public function getDbLink(){
		return $this->dbLink;
	}
	public function setDbLink($dbLink){
		$this->dbLink = $dbLink;
	}
	public function getDbLinkMaster(){
		return (isset($this->dbLinkMaster))? $this->dbLinkMaster:$this->dbLink;
	}
	public function setDbLinkMaster($dbLinkMaster){
		$this->dbLinkMaster = $dbLinkMaster;
	}
	public function add_file($pm){
		
	}
	public function get_file($pm){
		
	}
	public function get_base64($pm){
		
	}	
	public function set_file($pm){
		
	}

}