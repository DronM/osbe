<?php
class ExMethodProhobit extends Exception {
	public function __construct() {
		parent::__construct(ERR_COM_METH_PROHIB, 11);
	}
}

?>
