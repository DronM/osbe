<?php
require_once(FRAME_WORK_PATH.'Constants.php');

class XSLTStyler{
	const ER_STYLE_NOT_FOUND = 'Style not found!';
	
	/*	searches the file first in include
		then in current project style directory
		if none found retuns FALSE
	*/
	public static function getStyleFileIfExists($styleFileName){
		$styleFileName = XSLT_STYLE_PATH . $styleFileName;		
		if (file_exists($styleFileName)){
			return $styleFileName;
		}		
		else{
			$pathArray = explode( PATH_SEPARATOR, get_include_path());	
			$include_file = (count($pathArray)>=1)? $pathArray[1].'/'.FRAME_WORK_PATH.$styleFileName : FALSE;
			if ($include_file && file_exists($include_file)){
				return $include_file;
			}
		}				
		return FALSE;
	}
	
	public static function echoXMLOnStyle(&$xmlDoc, $styleFileName){
		echo XSLTStyler::transformXMLOnStyle($xmlDoc, $styleFileName);
	}
	public static function transformXMLOnStyle(&$xmlDoc, $styleFileName){
		$doc = new DOMDocument();     
		$xsl = new XSLTProcessor();
		$doc->load($styleFileName);
		$xsl->importStyleSheet($doc);
		if (DEBUG){
			$xmlDoc->formatOutput=TRUE;
			$xmlDoc->save('page.xml');
		}
		return $xsl->transformToXML($xmlDoc);
	}
	public static function write($xmlStr, $viewName=NULL,$roleName=NULL){
		$file_name = XSLTStyler::getStyleFileName($viewName,$roleName);
		if (!$file_name)
			throw new Exception(XSLTStyler::ER_STYLE_NOT_FOUND);
		$xmlDoc = new DOMDocument();
		//echo $xmlStr;
		$xmlDoc->loadXML($xmlStr);
		//echo 'XSLTStyler->write'.$file_name;
		XSLTStyler::echoXMLOnStyle($xmlDoc, $file_name);
	}
	public static function getStyleFileName($viewName=NULL,$roleName=NULL){
		if ($viewName && $roleName && ($file_name=XSLTStyler::getStyleFileIfExists($viewName.'.'.$roleName.'.xsl'))){
			return $file_name;
		}
		else if ($viewName && ($file_name=XSLTStyler::getStyleFileIfExists($viewName.'.xsl'))){
			return $file_name;
		}
		
		else if ($file_name=XSLTStyler::getStyleFileIfExists(XSLT_DEF_STYLE.'.xsl')){
			return $file_name;
		}	
		return FALSE;
		
	}
	
}

?>