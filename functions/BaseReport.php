<?php
require_once(BASE_PATH.'Config.php');
require_once(BASE_PATH.'common/downloader.php');
require_once(BASE_PATH.'common/PDFReport.php');

class BaseReport {
	const OUTPUT_DIR='output';
	const STYLES_PATH = 'views/';
	const ER_NO_FILE = 'Ошибка при формировании отчета!';
	
	public $XMLDoc;
	public $XMLRootNode;
	public $outPutDir;
	public $fileName;
	public $fileExt;
	
	public function __construct($fileName,$fileExt){
		$this->fileName = $fileName;
		$this->fileExt = $fileExt;
		
		$this->XMLDoc = new DOMDocument('1.0', 'UTF-8');
		$this->XMLRootNode = $this->XMLDoc->appendChild(new DOMElement('document'));	
		$this->outPutDir = BaseReport::OUTPUT_DIR.'/'.session_id();
	}
	public function getFullFileName(){
		return BASE_PATH.$this->outPutDir.'/'.$this->fileName.'.'.$this->fileExt;
	}
	public function toPDF(){
		//file output

		$file = $this->outPutDir.'/'.$this->fileName.'.pdf';
		$style_file = $this->fileName.'.pdf.xsl';
		
		if (!file_exists($this->outPutDir)){
			mkdir($this->outPutDir);
		}
		
		//FOP
		$xml_file = $this->outPutDir.'/'.$this->fileName.'.xml';
		if (file_exists($xml_file)){
			unlink($xml_file);
		}		
		
		$xslt_file = BaseReport::STYLES_PATH.$style_file;
		$this->XMLDoc->save($xml_file);
		
		if (file_exists($file)){
			unlink($file);
		}		
		
		PDFReport::createFromFile($xml_file, $xslt_file, $file);	
		//
		if (file_exists($xml_file)){
			unlink($xml_file);
		}		
	}
	
	public function getFile(){
		$file = $this->outPutDir.'/'.$this->fileName.'.'.$this->fileExt;
		if (file_exists($file)){
			downloadFile($file);
		}
		else{
			throw new Exception(BaseReport::ER_NO_FILE);
		}
	}
	public function deleteReport(){
		$file = $this->outPutDir.'/'.$this->fileName.'.'.$this->fileExt;
		if (file_exists($file)){
			unlink($file);
		}	
	}
	public function deleteTempDir(){
		//remove dir
		if (file_exists($this->outPutDir)){
			rmdir($this->outPutDir);
		}			
	}
	
}
?>