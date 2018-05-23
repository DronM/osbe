<?php
/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>
 
 * @class
 * @classdesc Manages all pakcage operations
 
 * @requires Config.php
  
 */

require_once('Manager.php');


class PackageManager extends Manager{

	const PACKAGE_DIR = 'packages';
	
	const PACKAGE_MD = 'metadata.xml';

	private static $ER_UNABLE_TO_EXTARCT = array(
		'ru' => 'Невозможно распаковать архив.'
	);

	private static $ER_PACKAGE_MD_NOT_FOUND = array(
		'ru' => 'Файл описания метаданных пакета не найден.'
	);

	private static $ER_MD_NO_METADATA = array(
		'ru' => 'Узел metadata не найден в файле метаданных.'
	);

	private static $NO_KEY_ATTR = array(
		'ru' => 'Не найден ключевой атрибут (id|file) тега: '
	);

	private static function parseHeaders($headers){
	    $head = array();
	    foreach( $headers as $k=>$v )
	    {
		$t = explode( ':', $v, 2 );
		if( isset( $t[1] ) )
		    $head[ strtolower(trim($t[0])) ] = trim( $t[1] );
		else{
		    $head[] = $v;
		    if( preg_match( "#HTTP/[0-9\.]+\s+([0-9]+)#",$v, $out ) )
		        $head['response_code'] = intval($out[1]);
		        $head['response_descr'] = $v;
		}
	    }
	    return $head;
	}

	/**
	 * @param {array} params
	 */
	private function execute_cmd(&$params,$expectFile){
		$params['c'] = 'Package_Controller';
		$params['v'] = 'ViewXML';
		$options = array(
			'http' => array(
				'method'  => 'POST',
				'header'  => array(
					'Content-type: application/x-www-form-urlencoded; charset="utf-8"'
					),
				'content' => http_build_query($params)
			)
		);
		$context = stream_context_create($options);
		$contents = file_get_contents(PACKAGE_HOST.'/index.php', FALSE, $context);
		$header_res = self::parseHeaders($http_response_header);
		if ($header_res['response_code'] && $header_res['response_code']!=200){
			throw new Exception($header_res['response_descr']);
		}		
		//echo 'header_res='.var_export($header_res).'</br>';
		if ($expectFile && isset($header_res['content-type']) && strpos($header_res['content-type'],'xml')!==FALSE){
			$xml = simplexml_load_string($contents);
			$error_n = $xml->xpath('/document/model/row');
			if (count($error_n)){	
				throw new Exception($error_n[0]->descr->__toString());
			}
		}
		return $contents;
	}

	/**
	 * @param {string} packageId
	 */
	public function getPackageInfo($packageId){
		$params = array(
			'f' => 'get_object',
			'id' => $packageId
		);	
		return $this->execute_cmd($params,FALSE);
	}
		
	/**
	 * @param {array} installParams = $_REQUEST from intsallation form
	 */
	public function install(&$installParams){
		$params = array(
			'f' => 'get_package',
			'id' => $installParams['package_id']
		);
		$contents = $this->execute_cmd($params,TRUE);
		//check for errors
		$f_name = OUTPUT_PATH.uniqid();
		$package_dir = OUTPUT_PATH.uniqid();
		mkdir($package_dir);
		try{
			$this->str_to_file($f_name,$contents);		
			$zip = new ZipArchive;
			if ($zip->open($f_name) === TRUE) {
			    $zip->extractTo($package_dir.DIRECTORY_SEPARATOR);
			    $zip->close();
			}
			else{
				throw new Exception(self::$ER_UNABLE_TO_EXTARCT[LOCALE]);
			}
			
			$f_package_md = $package_dir.DIRECTORY_SEPARATOR.self::PACKAGE_MD;
			if (!file_exists($f_package_md)){
				throw new Exception(self::$ER_PACKAGE_MD_NOT_FOUND[LOCALE]);
			}
			
			//open metadata
			$f_md = $this->getMdFile();
			$dom = new DOMDocument();			
			$dom->load($f_md);
			$xpath = new DOMXPath($dom);
			
			$dom_modif = FALSE;
			
			//open package metadata xml file
			$m = new Mustache_Engine;
			$package_xml = simplexml_load_string($m->render(file_get_contents($f_package_md),$installParams));

			//children: models,controllers,jsScripts...
			foreach ($package_xml->children() as $package_collection) {
				if (strtolower($package_collection->getName())=='install'){
					continue;
				}
				
				foreach ($package_collection->children() as $package_collection_item) {
					$package_collection_item_dom = $dom->importNode(dom_import_simplexml($package_collection_item), TRUE);
					if (isset($package_collection_item->attributes()->id)){
						$key_attr = "id";
						$key_attr_val = $package_collection_item->attributes()->id;
					}
					else if (isset($package_collection_item->attributes()->file)){
						$key_attr = "file";
						$key_attr_val = $package_collection_item->attributes()->file;
					}
					else{
						throw new Exception(self::$NO_KEY_ATTR[LOCALE].$package_collection_item->getName());
					}
					$collection_item_dom = $xpath->query(sprintf(
							"/metadata/%s/%s[@%s='%s']",
							$package_collection->getName(),
							$package_collection_item->getName(),
							$key_attr,
							$key_attr_val
						));
					if ($collection_item_dom->length){
						//item exists in old DOM - replace
						$package_collection_item_dom->setAttribute('cmd','alt');
						$collection_item_dom->item(0)->parentNode->replaceChild($package_collection_item_dom,$collection_item_dom->item(0));						
						$dom_modif = TRUE;
					}
					else{
						//add new item to collection
						$package_collection_item_dom->setAttribute('cmd','add');
						$collection_list_dom = $dom->getElementsByTagName($package_collection->getName());
						if (!$collection_list_dom->length){
							$collection_dom = $dom->createElement($package_collection->getName());
							$metadata_list_dom = $dom->getElementsByTagName('metadata');
							if (!$metadata_list_dom->length){
								throw new Exception(self::$ER_MD_NO_METADATA[LOCALE]);
							}
							$metadata_list_dom->item(0)->appendChild($collection_dom);
						}
						else{
							$collection_dom = $collection_list_dom->item(0);
						}
						$collection_dom->appendChild($package_collection_item_dom);
						$dom_modif = TRUE;
					}
				}				
				
			}
			
			if ($dom_modif){
				//copy original metadata
				$this->str_to_file($f_md.'.backup',file_get_contents($f_md));
				
				//$dom->save($f_md);			
				self::saveDOM($dom,$f_md);
			}
			
			//copy all package files
			$dir_handle = opendir($package_dir);
			while($file = readdir($dir_handle)){
				if($file!="." && $file!=".." && is_dir($package_dir.DIRECTORY_SEPARATOR.$file)){
				//echo 'COPY from '.$package_dir.DIRECTORY_SEPARATOR.$file.' ==>> '.$this->projectDir.'</br>';
					self::copyr($package_dir.DIRECTORY_SEPARATOR.$file, $this->projectDir);
				}
			}
			closedir($dir_handle);
			
			//copy zip to packages/
			$installed_packages_dir = $this->projectDir.DIRECTORY_SEPARATOR. self::BUILD_DIR.DIRECTORY_SEPARATOR.PACKAGE_DIR;
			if (!file_exists($installed_packages_dir)){
				mkdir($installed_packages_dir);
			}
			self::copyr($f_name,$installed_packages_dir.DIRECTORY_SEPARATOR.$installParams['package_id']);
		}
		finally{
			self::deleteDir($package_dir);
			unlink($f_name);
		}
	}
	
	/**
	 * @param {string} packageId
	 * @param {string} packageVersion
	 * @returns {string||NULL} Returns installed package version OR NULL if package with this packageId is not installed
	 */
	public function checkPackageVersion($packageId,$packageVersion){
		$xml = simplexml_load_file($this->getMdFile());		
		if (isset($xml->packages->package)){
			foreach($xml->packages->package as $package){			
				if (strtolower($package->attributes()->id)==strtolower($packageId)){
					return $package->attributes()->version;	
				}
			}
		}
	}	
}

?>
