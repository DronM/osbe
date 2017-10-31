<?php
require_once(FRAME_WORK_PATH.'basic_classes/View.php');
class ViewBeton extends View{	
	const ER_TEMPL_NOT_FOUND = 'Template not found.';
	const DEF_TEMPL_PATH = 'basic_classes/xslt/';
	const XSL_TEMPLATE = 'JSONBeton.xsl';
	
	public function write(ArrayObject &$models){		
		$pathArray = explode(PATH_SEPARATOR, get_include_path());
		if (!count($pathArray)
		|| !file_exists(
			$xslt_file=$pathArray[1].'/'.
			FRAME_WORK_PATH.ViewBeton::DEF_TEMPL_PATH.
			ViewBeton::XSL_TEMPLATE)){
			throw new Exception(ViewBeton::ER_TEMPL_NOT_FOUND);
		}
		
		//header
		$xml = '<?xml version="1.0" encoding="UTF-8"?>';
		
		//root node
		$xml.= '<document>';
				
		//MetaData && Data
		$modelsIt = $models->getIterator();
		while($modelsIt->valid()) {
			//$xml.= $modelsIt->current()->metadataToXML();
			$xml.= $modelsIt->current()->dataToXML(TRUE);
			$modelsIt->next();
		}
		
		//end root node
		$xml.= '</document>';
				
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
		
		ob_clean();		
		header('Access-Control-Allow-Origin: *');
		//text/html
		header('Content-Type: application/json; charset="utf-8"');		
		header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");  // disable IE caching
		header("Last-Modified: " . gmdate( "D, d M Y H:i:s") . " GMT");
		header("Cache-Control: no-cache, must-revalidate");
		header("Pragma: no-cache");		
		echo $xsl->transformToXML($xmlDoc);
		
	}
}	
?>