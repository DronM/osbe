<?php
require_once(FRAME_WORK_PATH.'basic_classes/View.php');

class ViewXML extends View{	
	public function write(ArrayObject $models){
		ob_clean();		
		header('Content-Type: text/xml; charset="utf-8"');
		header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");  // disable IE caching
		header("Last-Modified: " . gmdate( "D, d M Y H:i:s") . " GMT");
		header("Cache-Control: no-cache, must-revalidate");
		header("Pragma: no-cache");
		//header
		echo '<?xml version="1.0" encoding="UTF-8"?>';
		
		//root node
		echo '<document>';
		
		$modelsIt = $models->getIterator();
		while($modelsIt->valid()) {			
			echo $modelsIt->current()->dataToXML(TRUE);
			$modelsIt->next();			
		}		
		
		//end root node
		echo '</document>';
	}
}

?>
