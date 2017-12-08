<?php
/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>
 
 * @class
 * @classdesc Manages all pakcage operations
 
 * @requires Config.php
  
 */

require_once('Manager.php');


class CatHelper extends Manager{

	const REF_FIELD_DATA_TYPE = 'JSON';
	const HELPER_DIR = 'helpers';
	const SQL_VIEW_TMPL = 'view.sql.tmplm';
	const JS_LIST_VIEW_TMPL = 'list_view.js.tmplm';
	const JS_DLG_VIEW_TMPL = 'dlg_view.js.tmplm';
	const JS_REF_TMPL = 'EditRef.js.tmplm';
	const JS_FORM_TMPL = 'form.js.tmplm';

	private static $ER_BASE_MODEL_NOT_FOUND = array(
		'ru' => 'Базовая модель не найдена!'
	);
	private static $ER_BASE_MODEL_VIRTUAL = array(
		'ru' => 'Базовая модель не должна быть виртуальной!'
	);
	private static $ER_REF_KEY_COUNT_DIFFER = array(
		'ru' => "Количество ключевых полей таблицы '%s' отличается от базовой модели."
	);

	private function addJScriptToDOM($dom,$xpath,$scriptFile){
		$jsScripts_collect = $dom->getElementsByTagName('jsScripts');
		if ($jsScripts_collect->length){			
			$fl = str_replace($this->projectDir.DIRECTORY_SEPARATOR. $this->getJsDirectory().DIRECTORY_SEPARATOR,'',$scriptFile);
			$section = NULL;
			$fl_parts = explode(DIRECTORY_SEPARATOR,$fl);
			if (count($fl_parts)){
				$section = $fl_parts[0];
			}			
			$jsScript_collect = $xpath->query(sprintf("/metadata/jsScripts/jsScript[@file='%s']", $fl));
			if (!$jsScript_collect->length){
				$new_script = $dom->createElement('jsScript');
				$new_script->setAttribute('file', $fl);
				$added = FALSE;
				//append to the end of section || just append
				if (!is_null($section)){
					$scripts = $jsScripts_collect->item(0)->getElementsByTagName('jsScript');
					$started = FALSE;
					foreach($scripts as $script){
						$scr_sec = substr($script->getAttribute('file'),0,strlen($section));
						if (!$started && $scr_sec==$section){
							$started = TRUE;
							$last_section_node = $script;
						}
						else if ($started && $scr_sec!=$section){
							$jsScripts_collect->item(0)->insertBefore($new_script,$script);
							$added = TRUE;
							break;
						}
					}
				}
				if (!$added){
					$jsScripts_collect->item(0)->appendChild($new_script);
				}
			}	
		}
	}

	private function addSrvTemplateToDOM($dom,$xpath,$tmplId){
		$srvTmpls_collect = $dom->getElementsByTagName('serverTemplates');
		if ($srvTmpls_collect->length){	
			$srvTmpl_collect = $xpath->query(sprintf("/metadata/serverTemplates/serverTemplate[@id='%s']", $tmplId));
			if (!$srvTmpl_collect->length){
				$new_tmpl = $dom->createElement('serverTemplate');
				$new_tmpl->setAttribute('id',$tmplId);					
				$srvTmpls_collect->item(0)->appendChild($new_tmpl);
			}
		}
	}

	public function makeCatalogObjects(&$params){
		$dom = new DOMDocument();
		$dom->load($this->getMdFile());
		$xpath = new DOMXPath($dom);
		$model_collect = $xpath->query(sprintf("/metadata/models/model[@id='%s']", $params[PARAM_CAT_BASE_MODEL_ID]));		
		if (!$model_collect->length){
			throw new Exception(self::$ER_BASE_MODEL_NOT_FOUND[LOCALE]);
		}		
		$model = $model_collect->item(0);
		if ($model->getAttribute('virtual')=='TRUE'){
			throw new Exception(self::$ER_BASE_MODEL_VIRTUAL[LOCALE]);
		}
		$model_keys = array();
		$model_keys_collect = $xpath->query(sprintf("/metadata/models/model[@id='%s']/field[@primaryKey='TRUE']",$params[PARAM_CAT_BASE_MODEL_ID]));		
		for($i=0;$i<$model_keys_collect->length;$i++){
			array_push($model_keys,array(
				'not_first' => ($i)? TRUE:FALSE,
				'field' => $model_keys_collect->item($i)->getAttribute('id')
			));
		}	
		
		$LIST_VIEW = (isset($params[PARAM_CAT_LIST_VIEW]) && $params[PARAM_CAT_LIST_VIEW]=='1');
		$LIST_MODEL = (isset($params[PARAM_CAT_LIST_MODEL]) && $params[PARAM_CAT_LIST_MODEL]=='1');
		$DLG_VIEW = (isset($params[PARAM_CAT_DIALOG_VIEW]) && $params[PARAM_CAT_DIALOG_VIEW]=='1');
		$DLG_MODEL = (isset($params[PARAM_CAT_DIALOG_MODEL]) && $params[PARAM_CAT_DIALOG_MODEL]=='1');
		$CONTROLLER = (isset($params[PARAM_CAT_CONTROLLER]) && $params[PARAM_CAT_CONTROLLER]=='1');
		$LIST_TEMPLATE = (isset($params[PARAM_CAT_SRV_LIST_TEMPLATE]) && $params[PARAM_CAT_SRV_LIST_TEMPLATE]=='1');
		$DLG_TEMPLATE = (isset($params[PARAM_CAT_SRV_DIALOG_TEMPLATE]) && $params[PARAM_CAT_SRV_DIALOG_TEMPLATE]=='1');
		$VIEWS = (isset($params[PARAM_CAT_VIEWS]) && $params[PARAM_CAT_VIEWS]=='1');
		
		if ($LIST_MODEL){
			$new_list_model = $dom->createElement('model');
			$new_list_model->setAttribute('id',$params[PARAM_CAT_BASE_MODEL_ID].'List');
			$new_list_model->setAttribute('parent',$model->getAttribute('parent'));
			$new_list_model->setAttribute('dataTable',$model->getAttribute('dataTable').'_list');
			$new_list_model->setAttribute('virtual','TRUE');
			$new_list_model->setAttribute('baseModelId',$params[PARAM_CAT_BASE_MODEL_ID]);
		}
		
		if ($DLG_MODEL){
			$new_dlg_model = $dom->createElement('model');
			$new_dlg_model->setAttribute('id',$params[PARAM_CAT_BASE_MODEL_ID].'Dialog');
			$new_dlg_model->setAttribute('parent',$model->getAttribute('parent'));
			$new_dlg_model->setAttribute('dataTable',$model->getAttribute('dataTable').'_dialog');
			$new_dlg_model->setAttribute('virtual','TRUE');
			$new_dlg_model->setAttribute('baseModelId',$params[PARAM_CAT_BASE_MODEL_ID]);
		}
		
		if ($LIST_MODEL || $DLG_MODEL){
			$sql_view_params = array(
				'VIEW_ID' => '',
				'DB_SCHEMA' => '{{DB_SCHEMA}}',
				'DB_USER' => '{{DB_USER}}',
				'DB_TABLE' => $model->getAttribute('dataTable'),
				'JOIN' => array(),
				'ORDER' => array()
			);
		}
				
		if ($LIST_VIEW || $DLG_VIEW){
			$js_view_params = array(
				'VIEW_ID' => '',
				'ID' => $model->getAttribute('id'),
				'DIALOG_MODEL_ID' => $model->getAttribute('id').( ($DLG_MODEL)? 'Dialog':''),
				'LIST_MODEL_ID' => $model->getAttribute('id').( ($LIST_MODEL)? 'List':''),
				'KEYS' => $model_keys,
				'EDIT_INLINE' => ($DLG_MODEL)? 'false':'true',
				'FORM_ID' => ($DLG_MODEL)? ($model->getAttribute('id').( ($DLG_MODEL)? 'Dialog_Form':'_Form')):'null',
				'LIST_FORM_ID' => $model->getAttribute('id').( ($LIST_MODEL)? 'List_Form':'_Form'),
				'COLUMNS' => array()
			);
			
			$js_list_res_cont = '';
			$js_dlg_res_cont = '';
		}
		
		$js_custom_controls = array();
		$js_forms = array();
				
		$display_id = NULL;
		$fields = $xpath->query(sprintf("/metadata/models/model[@id='%s']/field",$params[PARAM_CAT_BASE_MODEL_ID]));		
		$field_ind = 0;
		foreach($fields as $field){
			if ($LIST_MODEL){
				$new_list_field = $dom->createElement('field');
			}
			if ($DLG_MODEL){
				$new_dlg_field = $dom->createElement('field');
			}
			
			$js_list_column = NULL;
			$js_dlg_field = NULL;
			
			if ($field->getAttribute('refField')!==''){
				//reference field
				$new_field_dt = self::REF_FIELD_DATA_TYPE;
				$new_field_id = $field->getAttribute('refTable').'_ref';
				
				array_push($sql_view_params['JOIN'],array(
					'table' => $field->getAttribute('refTable'),
					'keys' => array()
					)
				);
				$ref_model_id = '';
				$ref_keys = $xpath->query(sprintf("/metadata/models/model[@dataTable='%s']/field[@primaryKey='TRUE']",$field->getAttribute('refTable')));		
				for($i=0;$i<$ref_keys->length;$i++){
					array_push($sql_view_params['JOIN'][count($sql_view_params['JOIN'])-1]['keys'],array(
						'operand' => ($i)? 'AND ':'',
						'main_key' => $field->getAttribute('id'),
						'join_key' => $ref_keys->item($i)->getAttribute('id')
					));
					if ($i==0){
						$ref_model_id = $ref_keys->item(0)->parentNode->getAttribute('id');
					}
				}
				
				if ($LIST_VIEW){
					$js_list_column = sprintf('new GridColumnRef({"field":model.getField("%s"),"form":%sDialog_Form})',
						$new_field_id,$ref_model_id
					);
				}
				
				if ($DLG_VIEW){
					$js_dlg_field = sprintf('new %sEditRef(id+":%s",{
						"labelCaption":this.FIELD_CAP_%s
					})',
					$ref_model_id,
					$new_field_id,
					$new_field_id
					);
				}
				
				if (!isset($js_custom_controls[$ref_model_id])){
					$js_custom_controls[$new_field_id] = array(
						'ID' => $ref_model_id,
						'LABEL' => $ref_model_id. ( ($DLG_MODEL)? 'Dialog_View':'_View'). '.prototype.FIELD_CAP_'.$new_field_id,
						'LIST_FORM_ID' => $ref_model_id.( ($LIST_MODEL)? 'List_Form':'_Form'),
						'FORM_ID' => $ref_model_id.( ($DLG_MODEL)? 'Dialog_Form':'_Form'),
					);
				}

				if ($DLG_VIEW && !isset($js_forms[$ref_model_id.'Dialog'])){
					$js_forms[$new_field_id.'Dialog'] = array(
						'ID' => $ref_model_id.'Dialog',
						'CONTROLLER' => $ref_model_id,
						'METHOD' => 'get_object'
					);
				}

				if (!isset($js_forms[$ref_model_id.'List'])){
					$js_forms[$new_field_id.'List'] = array(
						'ID' => $ref_model_id.'List',
						'CONTROLLER' => $ref_model_id,
						'METHOD' => 'get_list'
					);
				}
				
			}
			
			else if($field->getAttribute('dataType')=='Enum'){
				//enum field
				$new_field_dt = 'String';
				$new_field_id = $field->getAttribute('id');
				
				if ($LIST_VIEW){
					$js_list_column = sprintf(
						'new EnumGridColumn_%s("%s",{"field":model.getField("%s")})',
						$field->getAttribute('enumId'),
						$new_field_id,
						$new_field_id
					);
				}
				if ($DLG_VIEW){
					$js_dlg_field = sprintf('new Enum_%s(id+":%s",{
						"labelCaption":this.FIELD_CAP_%s
					})',
					$field->getAttribute('enumId'),
					$new_field_id,
					$new_field_id
					);
				}
				
			}
			else{
				//ordinary field
				$new_field_dt = $field->getAttribute('dataType');
				$new_field_id = $field->getAttribute('id');
				
				if ($LIST_VIEW || $DLG_VIEW){
					switch ($new_field_dt) {
						case 'DateTime':
						case 'DateTimeTZ':
							$js_grid_col = 'GridColumnDateTime';
							$js_edit_field = 'EditDateTime';
							break;
						case 'Bool':
							$js_grid_col = 'GridColumnBool';
							$js_edit_field = 'EditCheckBox';
							break;						
						case 'Byte':
							$js_grid_col = 'GridColumnByte';
							$js_edit_field = 'EditInt';
							break;												
						case 'Date':
							$js_grid_col = 'GridColumnDate';
							$js_edit_field = 'EditDate';
							break;																		
						case 'Email':
							$js_grid_col = 'GridColumnEmail';
							$js_edit_field = 'EditEmail';
							break;																								
						case 'Float':
							$js_grid_col = 'GridColumnFloat';
							$js_edit_field = 'EditFloat';
							break;																														
						case 'Phone':
							$js_grid_col = 'GridColumnPhone';
							$js_edit_field = 'EditPhone';
							break;																																				
						default:
							$js_grid_col = 'GridColumn';
							$js_edit_field = 'EditString';
					}
					
					if ($LIST_VIEW){
						$js_list_column = sprintf('new %s({"field":model.getField("%s")})',$js_grid_col,$new_field_id);
					}
					if ($DLG_VIEW){
						$js_dlg_field = sprintf('new %s(id+":%s",{
							"labelCaption":this.FIELD_CAP_%s
						})',
						$js_edit_field,
						$new_field_id,
						$new_field_id
						);
					}					
				}				
			}
			
			if ($LIST_MODEL){
				$new_list_field->setAttribute('id',$new_field_id);
				$new_list_field->setAttribute('dataType',$new_field_dt);
				$new_list_model->appendChild($new_list_field);
			}
			if ($LIST_VIEW){
				$js_list_res_cont.= ($js_list_res_cont=='')? '':PHP_EOL;
				$js_list_res_cont.= sprintf('%s_View.prototype.COL_CAP_%s = "";', $params[PARAM_CAT_BASE_MODEL_ID].( ($LIST_MODEL)? 'List':''),$new_field_id);
			}
			
			if ($DLG_MODEL){
				$new_dlg_field->setAttribute('id',$new_field_id);			
				$new_dlg_field->setAttribute('dataType',$new_field_dt);			
				$new_dlg_model->appendChild($new_dlg_field);
			}
			if ($DLG_VIEW){
				$js_dlg_res_cont.= ($js_dlg_res_cont=='')? '':PHP_EOL;
				$js_dlg_res_cont.= sprintf('%s_View.prototype.FIELD_CAP_%s = "";', $params[PARAM_CAT_BASE_MODEL_ID].( ($DLG_MODEL)? 'Dialog':''),$new_field_id);
			}
			
			if ($field->getAttribute('display')=='TRUE'){
				$display_id = $field->getAttribute('id');
			}
			
			if ($LIST_VIEW || $DLG_VIEW){
				array_push($js_view_params['COLUMNS'],array(
					'not_first' => ($field_ind)? TRUE:FALSE,
					'id' => $new_field_id,
					'column' => $js_list_column,
					'dialog_field' => $js_dlg_field,
					'write_field_id' => $field->getAttribute('id')
				));
			}
						
			$field_ind++;
		}		
		
		if ($LIST_MODEL){
			if ($model->nextSibling!==NULL){
				$model->parentNode->insertBefore($new_list_model,$model->nextSibling);
			}
			else{
				$model->parentNode->appendChild($new_list_model);
			}
		}

		if ($DLG_MODEL){
			if ($model->nextSibling!==NULL){
				$model->parentNode->insertBefore($new_dlg_model,$model->nextSibling);
			}
			else{
				$model->parentNode->appendChild($new_dlg_model);
			}
		}
		
		//ORDER= display || primaryKeys
		if (!is_null($display_id)){
			array_push($sql_view_params['ORDER'],array(
				'field' => $display_id,
				'not_first' => FALSE
			));
		}
		else{
			$sql_view_params['ORDER'] = $model_keys;
		}		
		
		$m = new Mustache_Engine;
		
		//sql list view
		if ($LIST_MODEL){
			$sql_view_params['VIEW_ID'] = $model->getAttribute('dataTable').'_list';
			$fl = $this->projectDir.DIRECTORY_SEPARATOR. self::BUILD_DIR.DIRECTORY_SEPARATOR. self::SQL_DIR.DIRECTORY_SEPARATOR.$sql_view_params['VIEW_ID'].'.sql';
			if (!file_exists($fl)){
				$this->str_to_file(
					$fl,
					$m->render(
						file_get_contents($this->projectDir.DIRECTORY_SEPARATOR. self::BUILD_DIR.DIRECTORY_SEPARATOR. self::TEMPL_DIR.DIRECTORY_SEPARATOR. self::HELPER_DIR.DIRECTORY_SEPARATOR. self::SQL_VIEW_TMPL),
						$sql_view_params
					)
				);
			}
		}
				
		//sql dialog view
		if ($DLG_MODEL){
			$sql_view_params['VIEW_ID'] = $model->getAttribute('dataTable').'_dialog';
			$fl = $this->projectDir.DIRECTORY_SEPARATOR. self::BUILD_DIR.DIRECTORY_SEPARATOR. self::SQL_DIR.DIRECTORY_SEPARATOR.$sql_view_params['VIEW_ID'].'.sql';
			if (!file_exists($fl)){
				$this->str_to_file(
					$fl,
					$m->render(
						file_get_contents($this->projectDir.DIRECTORY_SEPARATOR. self::BUILD_DIR.DIRECTORY_SEPARATOR. self::TEMPL_DIR.DIRECTORY_SEPARATOR. self::HELPER_DIR.DIRECTORY_SEPARATOR. self::SQL_VIEW_TMPL),
						$sql_view_params
					)
				);
			}
		}
		
		//Controller
		if ($CONTROLLER){
			$controllers_collect = $dom->getElementsByTagName('controllers');
			if ($controllers_collect->length){
				$controller_collect = $xpath->query(sprintf("/metadata/controllers/controller[@id='%s']", $params[PARAM_CAT_BASE_MODEL_ID]));
				if (!$controller_collect->length){
					$new_controller = $dom->createElement('controller');
					$new_controller->setAttribute('id',$params[PARAM_CAT_BASE_MODEL_ID]);
					$new_controller->setAttribute('parentId','ControllerSQL');
			
					$meth = $dom->createElement('publicMethod');
					$meth->setAttribute('id','insert');
					$meth->setAttribute('modelId',$params[PARAM_CAT_BASE_MODEL_ID]);
					$new_controller->appendChild($meth);
			
					$meth = $dom->createElement('publicMethod');
					$meth->setAttribute('id','update');
					$meth->setAttribute('modelId',$params[PARAM_CAT_BASE_MODEL_ID]);			
					$new_controller->appendChild($meth);
			
					$meth = $dom->createElement('publicMethod');
					$meth->setAttribute('id','delete');
					$meth->setAttribute('modelId',$params[PARAM_CAT_BASE_MODEL_ID]);			
					$new_controller->appendChild($meth);

					$meth = $dom->createElement('publicMethod');
					$meth->setAttribute('id','get_object');
					$meth->setAttribute('modelId',$params[PARAM_CAT_BASE_MODEL_ID].( ($DLG_MODEL)? 'Dialog':'') );
					$new_controller->appendChild($meth);

					$meth = $dom->createElement('publicMethod');
					$meth->setAttribute('id','get_list');
					$meth->setAttribute('modelId',$params[PARAM_CAT_BASE_MODEL_ID].( ($LIST_MODEL)? 'List':'') );
					$new_controller->appendChild($meth);
			
					if (count($model_keys)){
						$meth = $dom->createElement('publicMethod');
						$meth->setAttribute('id','complete');
						$meth->setAttribute('patternFieldId',$model_keys[0]['field']);
						$meth->setAttribute('modelId',$params[PARAM_CAT_BASE_MODEL_ID].( ($LIST_MODEL)? 'List':'') );
						$new_controller->appendChild($meth);
					}
				
				
				
					$controllers_collect->item(0)->appendChild($new_controller);
					$this->addJScriptToDOM($dom, $xpath, $this->projectDir.DIRECTORY_SEPARATOR. $this->getJsDirectory().DIRECTORY_SEPARATOR.'controllers'.DIRECTORY_SEPARATOR.$params[PARAM_CAT_BASE_MODEL_ID].'_Controller.js');
				}
			}
		}
		
		//ServerTemplates list
		if ($LIST_TEMPLATE){
			$tmpl_id = $params[PARAM_CAT_BASE_MODEL_ID].( ($LIST_MODEL)? 'List':'' );
			$this->addSrvTemplateToDOM($dom, $xpath, $tmpl_id);
		}		
		//ServerTemplates dialog
		if ($DLG_TEMPLATE){
			$tmpl_id = $params[PARAM_CAT_BASE_MODEL_ID].( ($DLG_MODEL)? 'Dialog':'' );
			$this->addSrvTemplateToDOM($dom, $xpath, $tmpl_id);
		}		

		//views
		if ($VIEWS && $LIST_VIEW){
			$views_collect = $dom->getElementsByTagName('views');
			if ($views_collect->length){
				$views_id_collect = $xpath->query(sprintf("number(/metadata/views/view[@section='%s']/@id)",$params[PARAM_CAT_VIEWS_SEC]));
				$last_sec_id = 1;
				if ($views_id_collect->length){
					$last_sec_id = intval($views_id_collect->item(count($views_id_collect)-1));
					$last_sec_id++;
				}
				$new_view = $dom->createElement('view');
				$new_view->setAttribute('id', $last_sec_id);
				$new_view->setAttribute('c', $params[PARAM_CAT_BASE_MODEL_ID]. '_Controller');
				$new_view->setAttribute('t', $params[PARAM_CAT_BASE_MODEL_ID].( ($LIST_MODEL)? 'List':'' ) );
				$new_view->setAttribute('f', 'get_list');
				$new_view->setAttribute('section', $params[PARAM_CAT_VIEWS_SEC]);
				$new_view->setAttribute('descr', $params[PARAM_CAT_VIEWS_DESCR]);
				$views_collect->item(0)->appendChild($new_view);
			}
		}		
		
		//js list view
		if ($LIST_VIEW){
			$f_js_view = $js_view_params['ID']. ( ($LIST_MODEL)? 'List':''). '_View.js';
			$js_view_params['VIEW_ID'] = $f_js_view;
			$fl = $this->projectDir.DIRECTORY_SEPARATOR. $this->getJsDirectory().DIRECTORY_SEPARATOR. 'views'.DIRECTORY_SEPARATOR. $f_js_view;
			if (!file_exists($fl)){
				$this->str_to_file(
					$fl,
					html_entity_decode($m->render(
						file_get_contents($this->projectDir.DIRECTORY_SEPARATOR. self::BUILD_DIR.DIRECTORY_SEPARATOR. self::TEMPL_DIR.DIRECTORY_SEPARATOR. self::HELPER_DIR.DIRECTORY_SEPARATOR. self::JS_LIST_VIEW_TMPL),
						$js_view_params
					))
				);
			}
			//add view to DOM
			$this->addJScriptToDOM($dom, $xpath, $fl);
			
			//resource
			if ($js_list_res_cont!=''){
				$f_js_view = str_replace('.js','.rs_'.LOCALE.'.js',$f_js_view);
				$fl = $this->projectDir.DIRECTORY_SEPARATOR. $this->getJsDirectory().DIRECTORY_SEPARATOR. 'views'.DIRECTORY_SEPARATOR.'rs'.DIRECTORY_SEPARATOR. $f_js_view;
				if (!file_exists($fl)){
					$this->str_to_file($fl,$js_list_res_cont);
				}
				$this->addJScriptToDOM($dom, $xpath, $fl);
			}
			
		}

		if ($LIST_MODEL){
			$this->addJScriptToDOM($dom, $xpath, 'models'.DIRECTORY_SEPARATOR.$params[PARAM_CAT_BASE_MODEL_ID].'List_Model.js');
		}
		if ($DLG_MODEL){
			$this->addJScriptToDOM($dom, $xpath, 'models'.DIRECTORY_SEPARATOR.$params[PARAM_CAT_BASE_MODEL_ID]. 'Dialog_Model.js');
		}

		//js dialog view
		if ($DLG_VIEW){
			$f_js_view = $js_view_params['ID']. ( ($DLG_MODEL)? 'Dialog':''). '_View.js';
			$js_view_params['VIEW_ID'] = $f_js_view;
			$fl = $this->projectDir.DIRECTORY_SEPARATOR. $this->getJsDirectory().DIRECTORY_SEPARATOR. 'views'.DIRECTORY_SEPARATOR. $f_js_view;
			if (!file_exists($fl)){
				$this->str_to_file(
					$fl,
					html_entity_decode($m->render(
						file_get_contents($this->projectDir.DIRECTORY_SEPARATOR. self::BUILD_DIR.DIRECTORY_SEPARATOR. self::TEMPL_DIR.DIRECTORY_SEPARATOR. self::HELPER_DIR.DIRECTORY_SEPARATOR. self::JS_DLG_VIEW_TMPL),
						$js_view_params
					))
				);
			}			
			//add view to DOM
			$this->addJScriptToDOM($dom, $xpath, $fl);
			
			//resource
			if ($js_dlg_res_cont!=''){
				$f_js_view = str_replace('.js','.rs_'.LOCALE.'.js',$f_js_view);
				$fl = $this->projectDir.DIRECTORY_SEPARATOR. $this->getJsDirectory().DIRECTORY_SEPARATOR. 'views'.DIRECTORY_SEPARATOR.'rs'.DIRECTORY_SEPARATOR. $f_js_view;
				if (!file_exists($fl)){
					$this->str_to_file($fl,$js_dlg_res_cont);
				}
				$this->addJScriptToDOM($dom, $xpath, $fl);
			}
		}
		
		//custom_controls referencies
		foreach($js_custom_controls as $js_custom_control){
			$fl = $this->projectDir.DIRECTORY_SEPARATOR. $this->getJsDirectory().DIRECTORY_SEPARATOR. 'custom_controls'.DIRECTORY_SEPARATOR.$js_custom_control['ID'].'EditRef.js';
			if (!file_exists($fl)){
				$this->str_to_file(
					$fl,
					$m->render(
						file_get_contents($this->projectDir.DIRECTORY_SEPARATOR. self::BUILD_DIR.DIRECTORY_SEPARATOR. self::TEMPL_DIR.DIRECTORY_SEPARATOR. self::HELPER_DIR.DIRECTORY_SEPARATOR. self::JS_REF_TMPL),
						$js_custom_control
					)
				);
			}
			//add js script to DOM
			$this->addJScriptToDOM($dom, $xpath, $fl);
		}

		//forms
		foreach($js_forms as $js_form){
			$fl = $this->projectDir.DIRECTORY_SEPARATOR. $this->getJsDirectory().DIRECTORY_SEPARATOR. 'forms'.DIRECTORY_SEPARATOR.$js_form['ID'].'_Form.js';
			if (!file_exists($fl)){
				$this->str_to_file(
					$fl,
					$m->render(
						file_get_contents($this->projectDir.DIRECTORY_SEPARATOR. self::BUILD_DIR.DIRECTORY_SEPARATOR. self::TEMPL_DIR.DIRECTORY_SEPARATOR. self::HELPER_DIR.DIRECTORY_SEPARATOR. self::JS_FORM_TMPL),
						$js_form
					)
				);
			}
			//add js script to DOM
			$this->addJScriptToDOM($dom, $xpath, $fl);
		}
		
		//md backup
		$this->str_to_file($this->getMdFile().'.backup',file_get_contents($this->getMdFile()));
		self::saveDOM($dom,$this->getMdFile());
	}
	
}

?>
