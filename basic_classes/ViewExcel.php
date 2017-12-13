<?php
require_once(FRAME_WORK_PATH.'basic_classes/View.php');
require_once('common/downloader.php');

class ViewExcel extends View{	
	const DEF_TEMPL_NAME = 'ModelsToExcel';
	const DEF_TEMPL_PATH = 'basic_classes/xslt/';
	const TEMPL_EXT = ".xls.xsl";
	const ER_TEMPL_NOT_FOUND = "Template not found.";
	
	public function write(ArrayObject &$models,$errorCode=NULL){
		ob_clean();		
		
		if (isset($_REQUEST['templ'])
			&& file_exists(
				$xslt_file=USER_VIEWS_PATH.
				$_REQUEST['templ'].
				ViewExcel::TEMPL_EXT)){
			$templ_name = $_REQUEST['templ'];
		}
		else if (file_exists(
			$xslt_file=USER_VIEWS_PATH.
			$this->getId().ViewExcel::TEMPL_EXT)){
			$templ_name = $this->getId();
		}
		else{
			$pathArray = explode(PATH_SEPARATOR, get_include_path());
			if (!count($pathArray)
			|| !file_exists(
				$xslt_file=$pathArray[1].'/'.
				FRAME_WORK_PATH.ViewExcel::DEF_TEMPL_PATH.
				ViewExcel::DEF_TEMPL_NAME.ViewExcel::TEMPL_EXT)){
				throw new Exception(ViewExcel::ER_TEMPL_NOT_FOUND);
			}
			$templ_name = ViewExcel::DEF_TEMPL_NAME;
		}		
		//header
		$xml = '<?xml version="1.0" encoding="UTF-8"?>';
		
		//root node
		$xml.= '<document>';
		
		$modelsIt = $models->getIterator();
		while($modelsIt->valid()) {	
			$xml.= $modelsIt->current()->metadataToXML();
			$xml.= $modelsIt->current()->dataToXML(TRUE);
			$modelsIt->next();			
		}		
		//ToDO add XSLT support
		//end root node
		$xml.= '</document>';
		//echo $xml;
		//exit;
		$doc = new DOMDocument();     
		$xsl = new XSLTProcessor();
		$doc->load($xslt_file);
		$xsl->importStyleSheet($doc);
		$xmlDoc = new DOMDocument();
		$xmlDoc->loadXML($xml);
		if (DEBUG){
			$xmlDoc->formatOutput=TRUE;
			$xmlDoc->save('page.xml');
		}
		
		//uniqid()
		if (!file_exists(OUTPUT_PATH)){
			mkdir(OUTPUT_PATH);
		}
		$file = OUTPUT_PATH.$templ_name.".xls";
		file_put_contents($file,$xsl->transformToXML($xmlDoc));
		
		downloadFile($file);
		unlink($file);
	}
}

?>
