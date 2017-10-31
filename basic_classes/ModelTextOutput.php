<?php

class ModelTextOutput{

	private $id;
	private $dataStr;
	private $attrs;
	
	public function __construct($id,$dataStr=NULL,$attrs=NULL){
		$this->id = $id;
		$this->dataStr = $dataStr;
		$this->attrs = $attrs;
	}
	
	public function metadataToXML(){
		return '';
	}

	public function getId(){
		return $this->id;
	}
	
	public function dataToXML(){
		$attrs = '';
		if (is_array($this->attrs)){
			foreach($this->attrs as $name => $val){
				$attrs.= ' '.$name. '="'.$val.'"';
			}
		}
		return '<model id="'.$this->id.'"'.$attrs.'>'.$this->dataStr.'</model>';
	}
}
?>
