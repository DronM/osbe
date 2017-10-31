<?php
class View {	
	private $id;
	
	public function __construct($id=NULL){
		if (isset($id)){
			$this->setId($id);
		}
	}
	public function getId(){
		return (isset($this->id))? $this->id:get_class($this);
	}
	public function setId($id){
		$this->id = $id;
	}
	
	public function write(ArrayObject $models,$errorCode=NULL){
	}
}

?>
