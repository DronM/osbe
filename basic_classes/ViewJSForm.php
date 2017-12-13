<?php
//http://localhost/flowers/index.php?c=DOCMaterialProcurement_Controller&f=get_object&v=ViewJSForm&id=13&js_view=DOCMaterialProcurementDialog_View
//http://localhost/flowers/index.php?c=Material_Controller&f=get_object&v=ViewJSForm&id=80&js_view=MaterialDialog_View
//http://localhost/flowers/index.php?c=Material_Controller&f=get_list&v=ViewJSForm&count=30&from=0&js_view=MaterialList_View

require_once(USER_VIEWS_PATH.'ViewBase.php');
require_once(FRAME_WORK_PATH.'basic_classes/XSLTStyler.php');

class ViewJSForm extends ViewBase{	
	const ER_ARG_MIS = 'Java script view class not defind.';
	const TEMPL_PATH = 'basic_classes/xslt/';
	const TEMPL_NAME = 'JSForm.html.xsl';
	const ER_TEMPL_NOT_FOUND = 'XSLT template not found.';
	const PARAM_ID = 'js_view';

	public function __construct($id=NULL){
		parent::__construct($id);
		if (!isset($_REQUEST[ViewJSForm::PARAM_ID])){
			throw new Exception(ViewJSForm::ER_ARG_MIS);
		}
		$this->getVarModel()->addField(new Field('jsViewId',DT_STRING));
		$this->getVarModel()->insert();
		$this->setVarValue('jsViewId',$_REQUEST[ViewJSForm::PARAM_ID]);
	}
	public function write(ArrayObject &$models,$errorCode=NULL){
		if (!file_exists($xslt_file=USER_VIEWS_PATH.
				ViewJSForm::TEMPL_NAME)){
			$pathArray = explode(PATH_SEPARATOR, get_include_path());
			if (!count($pathArray)
			|| !file_exists(
				$xslt_file=$pathArray[1].'/'.
				FRAME_WORK_PATH.ViewJSForm::TEMPL_PATH.
				ViewJSForm::TEMPL_NAME)){
				throw new Exception(ViewJSForm::ER_TEMPL_NOT_FOUND);
			}
		}
		//header
		$xml = '<?xml version="1.0" encoding="UTF-8"?>';
		
		//root node
		$xml.= '<document>';
		
		//Data
		$modelsIt = $models->getIterator();
		while($modelsIt->valid()) {
			$xml.= $modelsIt->current()->dataToXML(TRUE);
			$modelsIt->next();
		}
		
		$xml.= $this->getVarModel()->dataToXML(TRUE);
		
		$modelsIt = $this->getCssModelIterator();
		while($modelsIt->valid()) {
			$xml.= $modelsIt->current()->dataToXML(TRUE);
			$modelsIt->next();
		}
		$modelsIt = $this->getJsModelIterator();
		while($modelsIt->valid()) {
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
		echo $xsl->transformToXML($xmlDoc);		
	}
}

?>
