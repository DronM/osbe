<?PHP
///////////////////////////////////////////////////////
class DB_Sql {
	var $database = "";

	var $link_id  = 0;
	var $query_id = 0;
	var $record   = array();

	var $errdesc    = "";
	var $errno   = 0;
	var $reportError = 0;

	public $appname;
	public $appshortname;
	public $usepconnect;      
	public $technicalemail;

	public $showqueries;
	public $explain;
	public $querytime;
  
	function connect($server, $user, $password, $port=NULL) {
		$s = '';
		if ($server){
			$s.='host='.$server;
		}
		if ($port){
			$s.=($s=='')? '':' ';
			$s.='port='.$port;
		}
		$this->link_id=pg_pconnect(
			sprintf('%s dbname=%s user=%s password=%s',
			$s, $this->database, $user, $password,$port)
		);
		if ($this->link_id===FALSE){
			throw new Exception('Connection failed '.sprintf('host=%s dbname=%s',
					$server, $this->database)
				);
		}
	}

	function close() {
		pg_close($this->link_id);
	}

	function set_error_verbosity($level) {
		pg_set_error_verbosity($this->link_id,$level);
	}

	function getErrorDescr() {
		$this->error=pg_last_error();
		return $this->error;
	}

	function getErrorNo() {
		$this->errno=0;
		return $this->errno;
	}

	function select_db($database="") {
	}

	function query($query_string) {
		if ($this->showqueries) {
			echo "Query: $query_string\n";

			$pageendtime=microtime();
			$endtime=explode(" ",$pageendtime);

			$beforetime=$endtime[0]+$endtime[1];

			echo "Time before: $beforetime\n";
		}

		$this->query_id = @pg_query($this->link_id,$query_string);
		if (!$this->query_id){
	      		$this->halt("Invalid SQL: ".$query_string);
	    	}

		if ($this->showqueries) {
			$pageendtime = microtime();
			$endtime = explode(" ",$pageendtime);
			$aftertime = $endtime[0]+$endtime[1];
			$querytime+= $aftertime-$beforetime;

			echo "Time after:  $aftertime\n";

			if ($this->explain and substr(trim(strtoupper($query_string)),0,6)=="SELECT") {
				$explain_id = pg_query($this->link_id,"EXPLAIN $query_string",$this->link_id);
				echo "</pre>\n";
				echo "
				<table width=100% border=1 cellpadding=2 cellspacing=1>
				<tr>
				  <td><b>table</b></td>
				  <td><b>type</b></td>
				  <td><b>possible_keys</b></td>
				  <td><b>key</b></td>
				  <td><b>key_len</b></td>
				  <td><b>ref</b></td>
				  <td><b>rows</b></td>
				  <td><b>Extra</b></td>
				</tr>\n";
				while($array=pg_fetch_array($explain_id)) {
					echo "
						<tr>
						<td>$array[table]&nbsp;</td>
						<td>$array[type]&nbsp;</td>
						<td>$array[possible_keys]&nbsp;</td>
						<td>$array[key]&nbsp;</td>
						<td>$array[key_len]&nbsp;</td>
						<td>$array[ref]&nbsp;</td>
						<td>$array[rows]&nbsp;</td>
						<td>$array[Extra]&nbsp;</td>
						</tr>\n";
				}
				echo "</table>\n<BR><hr>\n";
				echo "\n<pre>";
			}
			else{
				echo "\n<hr>\n\n";
			}
		}

		return $this->query_id;
	}
	
	function affected_rows($query_id=NULL) {
		if (is_null($query_id)) {
			$query_id = $this->query_id;
		}		
		return pg_affected_rows($query_id);
	}
  
	function fetch_array($query_id=-1,$query_string="") {
		// retrieve row
		if ($query_id!=-1) {
			$this->query_id=$query_id;
		}
		if ( isset($this->query_id) ) {
			$this->record = pg_fetch_assoc($this->query_id);
		}
		else{
			if ( !empty($query_string) ) {
				$this->halt("Invalid query id (".$this->query_id.") on this query: $query_string");
			}
			else {
				$this->halt("Invalid query id ".$this->query_id." specified");
			}
		}

		return $this->record;
	}
  
	function fetch_object($query_id=-1,$query_string="") {
		// retrieve row
		if ($query_id!=-1) {
			$this->query_id=$query_id;
		}
		if ( isset($this->query_id) ) {
			$this->record = pg_fetch_object($this->query_id);
		}
		else{
			if ( !empty($query_string) ) {
				$this->halt("Invalid query id (".$this->query_id.") on this query: $query_string");
			}
			else{
				$this->halt("Invalid query id ".$this->query_id." specified");
			}
		}

		return $this->record;
	}

	function free_result($query_id=-1) {
		// retrieve row
		if ($query_id!=-1) {
			$this->query_id=$query_id;
		}
		pg_free_result($this->query_id);
	}

	function query_first($query_string) {
		// does a query and returns first row
		$query_id = $this->query($query_string);
		$returnarray = $this->fetch_array($query_id, $query_string);
		$this->free_result($query_id);
		return $returnarray;
	}

	function data_seek($pos,$query_id=-1) {
		// goes to row $pos
		if ($query_id!=-1) {
			$this->query_id=$query_id;
		}
		return pg_result_seek($this->query_id, $pos);
	}

	function fetch_result($query_id=-1,$row=0,$field=0) {
		// retrieve row
		if ($query_id!=-1) {
			$this->query_id=$query_id;
		}
		if ( isset($this->query_id) ) {
			$this->record = pg_fetch_result($this->query_id,$row,$field);
		}
		else {
			$this->halt("Invalid query id ".$this->query_id." specified");
		}
		return $this->record;
	}
  
	function num_rows($query_id=-1) {
		// returns number of rows in query
		if ($query_id!=-1) {
			$this->query_id=$query_id;
		}
		return pg_num_rows($this->query_id);
	}

	function num_fields($query_id=-1) {
		// returns number of fields in query
		if ($query_id!=-1) {
			$this->query_id=$query_id;
		}
		return pg_num_fields($this->query_id);
	}

	function halt($msg) {
		$this->errdesc=pg_last_error($this->link_id);
		$this->errno=0;
		// prints warning message when there is an error

		if ($this->reportError) {
			$message="Database error in $this->appname: $msg\n";
			$message.="error: $this->errdesc\n";
			$message.="error number: $this->errno\n";
			$message.="Date: ".date("l dS of F Y h:i:s A")."\n";
			//$message.="Script: " . (($scriptpath) ? $scriptpath : getenv("REQUEST_URI")) . "\n";
			$message.="Referer: ".getenv("HTTP_REFERER")."\n";

			//@mail ($this->technicalemail,"$this->appshortname Database error!",$message,"From: \"".getenv("HTTP_HOST")."\"");
			/*
			echo "<p>$message</p>";

			echo "<p>There seems to have been a slight problem with the database.\n";
			echo "Please try again by pressing the refresh button in your browser.</p>";
			//echo "An E-Mail has been dispatched to our <a href=\"mailto:$contactemail\">Technical Staff</a>, who you can also contact if the problem persists.</p>";
			echo "<p>We apologize for any inconvenience. View the page source to display error.</p>";

			die("");
			 */
			 throw new Exception($message);
		}
		else{
			throw new Exception($this->errdesc);
			//'Во время выполнения запроса к базе данных произошла ошибка.');
		}	
	}
	function start_transaction() {
		$this->query('START TRANSACTION');
	}
	function rollback_transaction() {
		$this->query('ROLLBACK');
	}
	function commit_transaction() {
		$this->query('COMMIT');
	}
	
	function escape_string($str) {
		return pg_escape_string($str);
	}

}
?>
