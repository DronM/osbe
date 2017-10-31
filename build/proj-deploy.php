<?php
/*
Для старта нового проекта
Необходимо запустить скрипт в папке с проектом
*/
?>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
	</head>
	<body>
	<h2>New project deploying</h2>

<?php	
	define('CMD_START','start');
	
	define('PROJECT_DIR', dirname(__FILE__));
	define('FW_DIR', stream_resolve_include_path('fw_20'));
	define('REPO_DIR',FW_DIR.'/build');
	
	define('DEF_BUILF_FILE_PERM','0664');
	define('DEF_BUILF_DIR_PERM','0775');
	define('DEF_JS_DIR','js20');
	define('LOG_NAME','build.log');	
		
	$proj_dir_name_ar = explode('/',PROJECT_DIR);
	$proj_dir_name = $proj_dir_name_ar[count($proj_dir_name_ar)-1];
	
	if ($_REQUEST && isset($_REQUEST['cmd']) && $_REQUEST['cmd']==CMD_START){
	
		require_once("common/Logger.php");
		require_once(REPO_DIR."/ProjectManager.php");
		
		$perm_ar = array(
			'buildGroup' => $_REQUEST['START_PROJ_FIELD_BUILD_GROUP'],
			'buildFilePermission' => $_REQUEST['START_PROJ_FIELD_BUILD_FILE_PERMISSION'],
			'buildDirPermission' => $_REQUEST['START_PROJ_FIELD_BUILD_DIR_PERMISSION']
		);
		
		$proj_man = new ProjectManager(PROJECT_DIR, REPO_DIR, $_REQUEST['START_PROJ_FIELD_JS_DIR'], $perm_ar);
		
		//logger
		$log = new Logger(PROJECT_DIR.'/build/'. LOG_NAME, $perm_ar);

		$proj_man->startProject($_REQUEST,$log);
		
		
		$it = $log->getLineIterator();
		while($it->valid()){
			echo '<div>'.$it->current().'</div>';
			$it->next();
		}
		
		$str_res = "New project successfully created!";
		
		$log->add($str_res,'note');
			
		$log->dump();
		
		echo '<p>'.$str_res.'</p>';
		
		echo '<a href="build/">==>> Build</a>';
		//header('Location: build');
	}
	
	echo '<form action="proj-deploy.php" method="POST" name=""
	enctype="multipart/form-data">
		<input type="hidden" value="'.CMD_START.'" name="cmd" class="form-horizontal"/>

		<fieldset>
			<legend>Project</legend>
			<div class="form-group">
				<label for="START_PROJ_FIELD_APP_NAME" class="col-sm-4 control-label">Project id:</label>
				<div class="col-sm-4">
					<input type="text" value="'.$proj_dir_name.'" name="START_PROJ_FIELD_APP_NAME"/>
				</div>
			</div>
			<div class="form-group">
				<label for="START_PROJ_FIELD_AUTHOR" class="col-sm-4 control-label">Author name:</label>
				<div class="col-sm-4">
					<input type="text" value="" name="START_PROJ_FIELD_AUTHOR"/>
				</div>
			</div>			
			<div class="form-group">
				<label for="START_PROJ_FIELD_TECH_EMAIL" class="col-sm-4 control-label">Author email:</label>
				<div class="col-sm-4">
					<input type="text" value="" name="START_PROJ_FIELD_TECH_EMAIL"/>
				</div>
			</div>
			<div class="form-group">
				<label for="START_PROJ_FIELD_JS_DIR" class="col-sm-4 control-label">Javascript directory:</label>
				<div class="col-sm-4">
					<input type="text" value="'.DEF_JS_DIR.'" name="START_PROJ_FIELD_JS_DIR"/>
				</div>
			</div>			
						
			<div class="form-group">
				<div>Empty project MUST exist on github!!!</div>
				<label for="START_PROJ_FIELD_GITHUB_USER" class="col-sm-4 control-label">GITHub user name:</label>
				<div class="col-sm-4">
					<input type="text" value="" name="START_PROJ_FIELD_GITHUB_USER"/>
				</div>
			</div>			
			<div class="form-group">
				<label for="proj_descr" class="col-sm-4 control-label">Project description:</label>
				<div class="col-sm-4">
					<textarea name="proj_descr" rows="4"></textarea>
				</div>
			</div>			
			
		</fieldset>

		<fieldset>
			<legend>File permissions</legend>
			<div class="form-group">
				<label for="START_PROJ_FIELD_BUILD_GROUP" class="col-sm-4 control-label">User group:</label>
				<div class="col-sm-4">
					<input type="text" value="andrey" name="START_PROJ_FIELD_BUILD_GROUP"/>
				</div>
			</div>
			<div class="form-group">
				<label for="START_PROJ_FIELD_BUILD_FILE_PERMISSION" class="col-sm-4 control-label">File mode:</label>
				<div class="col-sm-4">
					<input type="text" value="'.DEF_BUILF_FILE_PERM.'" name="START_PROJ_FIELD_BUILD_FILE_PERMISSION" id="file_perm_mode"/>
				</div>
			</div>
			<div class="form-group">
				<label for="START_PROJ_FIELD_BUILD_DIR_PERMISSION" class="col-sm-4 control-label">Directory mode:</label>
				<div class="col-sm-4">
					<input type="text" value="'.DEF_BUILF_DIR_PERM.'" name="START_PROJ_FIELD_BUILD_DIR_PERMISSION"/>
				</div>
			</div>
		</fieldset>
				
		<fieldset>
			<legend>Database</legend>
			<div class="form-group">
				<label for="START_PROJ_FIELD_DB_NAME" class="col-sm-4 control-label">Database name:</label>
				<div class="col-sm-4">
					<input type="text" value="'.$proj_dir_name.'" name="START_PROJ_FIELD_DB_NAME"/>
				</div>
			</div>

			<div class="form-group">
				<label for="START_PROJ_FIELD_DB_USER" class="col-sm-4 control-label">Database user name:</label>
				<div class="col-sm-4">
					<input type="text" value="'.$proj_dir_name.'" name="START_PROJ_FIELD_DB_USER"/>
				</div>
			</div>

			<div class="form-group">
				<label for="START_PROJ_FIELD_PASSWORD" class="col-sm-4 control-label">Database user password:</label>
				<div class="col-sm-4">
					<input type="text" value="" name="START_PROJ_FIELD_DB_PASSWORD"/>
				</div>
			</div>
		</fieldset>
		
		<input type="submit" value="New project" name="submit"/>
	</form>';
	
?>

	</body>
</html>
