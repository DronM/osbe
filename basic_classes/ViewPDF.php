<?php
require_once(FRAME_WORK_PATH.'basic_classes/View.php');
require_once('common/downloader.php');
require_once('common/PDFReport.php');
//ф
class ViewPDF extends View{	
	const ER_TEMPL_NOT_FOUND='Template not found.';
	const DEF_TEMPL_NAME = 'toPDF';
	const DEF_TEMPL_PATH = "basic_classes/xslt/";
	const TEMPL_EXT = ".pdf.xsl";
	const ER_FILE_NOT_FOUND = 'Ошибка формирования PDF.';
	
	public function write(ArrayObject $models){
		ob_clean();		

		if (isset($_REQUEST['templ'])
			&& file_exists(
				USER_VIEWS_PATH.
				$_REQUEST['templ'].
				ViewPDF::TEMPL_EXT)){
			$templ_name = $_REQUEST['templ'];
			$templ_path = 'views/';
		}
		else if (file_exists(
			USER_VIEWS_PATH.
			$this->getId().ViewPDF::TEMPL_EXT)){
			$templ_name = $this->getId();
			$templ_path = USER_VIEWS_PATH;
		}
		else{
			$pathArray = explode(PATH_SEPARATOR, get_include_path());
			if (!count($pathArray)
			|| !file_exists(
				$pathArray[1].'/'.
				FRAME_WORK_PATH.ViewPDF::DEF_TEMPL_PATH.
				ViewPDF::DEF_TEMPL_NAME.ViewPDF::TEMPL_EXT)){
				throw new Exception(ViewPDF::ER_TEMPL_NOT_FOUND);
			}
			$templ_name = ViewPDF::DEF_TEMPL_NAME;
			//$templ_path = $pathArray[1].'/'.FRAME_WORK_PATH
		}		
		$xslt_file = $templ_path.$templ_name.ViewPDF::TEMPL_EXT;
//throw new Exception($xslt_file);

		//header
		$xml = '<?xml version="1.0" encoding="UTF-8"?>';
		
		//root node
		$xml.= '<document>';
		
		$modelsIt = $models->getIterator();
		while($modelsIt->valid()) {	
			$xml.= $modelsIt->current()->dataToXML(TRUE);
			$modelsIt->next();			
		}				
		//end root node
		$xml.= '</document>';
		//echo $xml;
		//save to file
		$xml_file = OUTPUT_PATH.uniqid().".xml";
		file_put_contents($xml_file,$xml);
		
		//FOP
		$stored_exc = null;
		try{
			$out_file = OUTPUT_PATH.$templ_name.".pdf";
			PDFReport::createFromFile($xml_file, $xslt_file, $out_file);
		
		//$out_file = ABSOLUTE_PATH.$out_file;
		//throw new Exception($xml_file);
			//download
			if (!file_exists($out_file)){
				throw new Exception(ViewPDF::ER_FILE_NOT_FOUND);
			}
			downloadFile($out_file);
		}
		catch (Exception $exc) {
			$stored_exc = $exc;
		}
		
		if (file_exists($xml_file)){
			//unlink($xml_file);
		}
		if (file_exists($out_file)){
			//unlink($out_file);
		}
		
		if ($stored_exc) {
			throw($stored_exc);
		}		
	}
}

?>
