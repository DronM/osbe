<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
	</head>
	<body>
	<h1>Package manager 1.0</h1>

<?php
	require_once("PackageManager.php");
	
	define('REPO_DIR',realpath(dirname(__FILE__)));
	
	//commands
	define('SBMT_FIND','find_package');
	define('SBMT_INSTALL','install_package');
	define('PARAM_ID','package_id');
	
	echo '</br>';
	echo '</br>';
	echo '<form action="package.php" method="POST" name=""
	enctype="multipart/form-data">
		<div class="form-group">							
			<label for="version">Package id:</label>
			<input type="text" name="'.PARAM_ID.'" size="10" maxlength="100" value="'.(isset($_REQUEST[PARAM_ID])? $_REQUEST[PARAM_ID]:"").'" required="required"/>
		</div>
		<input type="submit" value="Find" name="'.SBMT_FIND.'"/>
	</form>';	
	echo '</br>';
	
	//command
	if (isset($_REQUEST[SBMT_FIND])){
		$man = new PackageManager(
			substr(ABSOLUTE_PATH,0,strlen(ABSOLUTE_PATH)-1),
			REPO_DIR,
			substr(USER_JS_PATH,0,strlen(USER_JS_PATH)-1),
			array(
				'buildGroup' => BUILD_GROUP,
				'buildFilePermission' => BUILD_FILE_PERMISSION,
				'buildDirPermission' => BUILD_DIR_PERMISSION
			)
		);	
		echo '</br>';
		try{
			$res = simplexml_load_string($man->getPackageInfo($_REQUEST[PARAM_ID]));		
			foreach($res->model as $model){
				if ($model->attributes()->id=='ModelServResponse'){
					if (intval($model->row[0]->result)){
						echo '<h3>ERROR:'.$model->row[0]->descr.'</h3>';
						break;
					}
				}
				else if ($model->attributes()->id=='PackageDialog_Model'){
					//instll form generation
				
				
					$form = '<form action="package.php" method="POST" name=""
					enctype="multipart/form-data">
						<p><strong>Version:</strong> '.$model->row[0]->version.'</p>
						<p><strong>Short description:</strong> '.$model->row[0]->descr.'</p>
						<p><strong>Full description:</strong> '.$model->row[0]->descr_full.'</p>
						<input type="hidden" value="'.$_REQUEST[PARAM_ID].'" name="'.PARAM_ID.'"/>
					';
				
					$installed_version = $man->checkPackageVersion($_REQUEST[PARAM_ID],$model->row[0]->version->__toString());
					echo 'INSTALLED='.$installed_version.'</BR>';
				
					if (is_null($installed_version) || $man->versionAsNumber($installed_version)<$man->versionAsNumber($model->row[0]->version->__toString())){
						//dynamic inputs
						$install_params = json_decode( $model->row[0]->install_params);
						if (isset($install_params->rows) && is_array($install_params->rows)){
							$form.='<p><strong>Install parameters:</strong></p>';
							$form.='<table>';						
							foreach($install_params->rows as $row){
								$descr = json_decode($row->fields->descr,TRUE);
								$def = (isset($row->fields->default_value))? $row->fields->default_value:"";
								$form.='<tr>';
								$form.='<td><strong>'.$descr[LOCALE].':</strong></td>';						
								$form.='<td><input type="text" required="required" value="'.$def.'" name="'.$row->fields->id.'"/>
								</td>';
								$form.='</tr>';
							}
							$form.='</table>';
						}
				
				
						$form.= '<input type="submit" value="Install" name="'.SBMT_INSTALL.'"/>
						</form>';	
				
						echo $form;
					}
					else{
						echo '<p><strong>Already installed the same or newer version!</strong></p>';
						echo '<p>Current version:<strong>'.$model->row[0]->version.'</strong></p>';
						echo '<p>Installed version:<strong>'.$installed_version.'</strong></p>';
					}
				}
			}
		}
		catch (Exception $e){
			echo '<p>Error:'.$e->getMessage().'</p>';
		}
	}
	else if (isset($_REQUEST[SBMT_INSTALL])){
		$man = new PackageManager(
			substr(ABSOLUTE_PATH,0,strlen(ABSOLUTE_PATH)-1),
			REPO_DIR,
			substr(USER_JS_PATH,0,strlen(USER_JS_PATH)-1),
			array(
				'buildGroup' => BUILD_GROUP,
				'buildFilePermission' => BUILD_FILE_PERMISSION,
				'buildDirPermission' => BUILD_DIR_PERMISSION
			)
		);
		try{	
			$man->install($_REQUEST);
			echo '<p>Package installed successfully!</p>';
		}
		catch (Exception $e){
			echo '<p>Error:'.$e->getMessage().'</p>';
		}
	}
	
?>

	</body>
</html>
