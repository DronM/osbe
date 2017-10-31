<?PHP
///////////////////////////////////////////////////////
function get_full_user_name($user,$server){
	return '"'.$user.'"@"'.$server.'"';
}

class DB_Sql {
  var $link_id  = 0;
  var $query_id = 0;
  var $record   = array();

  var $errdesc    = "";
  var $errno   = 0;
  var $reporterror = 0;

  public $appname;
  public $appshortname;
  public $usepconnect;      
  public $technicalemail;

  public $showqueries;
  public $explain;
  public $querytime;
  
  public $server;
  public $user;
  public $password;
  public $database = "";
  
  function connect($server=null, $user=null, $password=null) {
    if ( 0 == $this->link_id ) {
		if (isset($server)){
			$this->server = $server;
		}
		if (isset($user)){
			$this->user = $user;
		}
		if (isset($password)){
			$this->password = $password;
		}
		
		try{
			if ($this->usepconnect==1) {
			  $this->link_id=mysql_pconnect($this->server,$this->user,$this->password);
			} 
			else {
				$this->link_id=mysql_connect($this->server,$this->user,$this->password);
				mysql_query("SET NAMES 'utf8'",$this->link_id);
			}
		}
		catch (Exception $e) {
		}
      if (!$this->link_id) {
        $this->halt("Link-ID == false, connect failed");
      }
      if ($this->database!="") {
        if(!mysql_select_db($this->database, $this->link_id)) {
          $this->halt("cannot use database ".$this->database);
        }
      }
    }
  }

  function close() {
     mysql_close($this->link_id);
  }

  function geterrdesc() {
    $this->error=mysql_error();
    return $this->error;
  }

  function geterrno() {
    $this->errno=mysql_errno();
    return $this->errno;
  }

  function select_db($database="") {
    // select database
    if ($database!="") {
      $this->database=$database;
    }
	$this->connect();
    if(!mysql_select_db($this->database, $this->link_id)) {
      $this->halt("cannot use database ".$this->database);
    }

  }

  function query($query_string) {
	$this->connect();
	
    if ($this->showqueries) {
      echo "Query: $query_string\n";

      $pageendtime=microtime();
      $endtime=explode(" ",$pageendtime);

      $beforetime=$endtime[0]+$endtime[1];

      echo "Time before: $beforetime\n";
    }

    $this->query_id = mysql_query($query_string,$this->link_id);
    if (!$this->query_id) {
      $this->halt("Invalid SQL: ".$query_string);
    }

    if ($this->showqueries) {
      $pageendtime=microtime();
      $endtime=explode(" ",$pageendtime);
          $aftertime=$endtime[0]+$endtime[1];
      $querytime+=$aftertime-$beforetime;

      echo "Time after:  $aftertime\n";

      if ($this->explain and substr(trim(strtoupper($query_string)),0,6)=="SELECT") {
        $explain_id = mysql_query("EXPLAIN $query_string",$this->link_id);
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
        while($array=mysql_fetch_array($explain_id)) {
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
      } else {
        echo "\n<hr>\n\n";
      }
    }

    return $this->query_id;
  }

  function fetch_array($query_id=-1,$query_string="") {
	$this->connect();
    // retrieve row
    if ($query_id!=-1) {
      $this->query_id=$query_id;
    }
    if ( isset($this->query_id) ) {
      $this->record = mysql_fetch_assoc($this->query_id);
    } else {
      if ( !empty($query_string) ) {
        $this->halt("Invalid query id (".$this->query_id.") on this query: $query_string");
      } else {
        $this->halt("Invalid query id ".$this->query_id." specified");
      }
    }

    return $this->record;
  }
  
  function fetch_object($query_id=-1,$query_string="") {
	$this->connect();
    // retrieve row
    if ($query_id!=-1) {
      $this->query_id=$query_id;
    }
    if ( isset($this->query_id) ) {
      $this->record = mysql_fetch_object($this->query_id);
    } else {
      if ( !empty($query_string) ) {
        $this->halt("Invalid query id (".$this->query_id.") on this query: $query_string");
      } else {
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
    return @mysql_free_result($this->query_id);
  }

  function query_first($query_string) {
	$this->connect();
    // does a query and returns first row
    $query_id = $this->query($query_string);
    $returnarray = $this->fetch_array($query_id, $query_string);
    $this->free_result($query_id);
    return $returnarray;
  }

  function data_seek($pos,$query_id=-1) {
	$this->connect();
    // goes to row $pos
    if ($query_id!=-1) {
      $this->query_id=$query_id;
    }
    return mysql_data_seek($this->query_id, $pos);
  }

  function num_rows($query_id=-1) {
    // returns number of rows in query
    if ($query_id!=-1) {
      $this->query_id=$query_id;
    }
    return mysql_num_rows($this->query_id);
  }

  function num_fields($query_id=-1) {
    // returns number of fields in query
    if ($query_id!=-1) {
      $this->query_id=$query_id;
    }
    return mysql_num_fields($this->query_id);
  }

  function insert_id() {
    // returns last auto_increment field number assigned
    return mysql_insert_id($this->link_id);
  }

  function escape_string($str) {
	$this->connect();
    // returns last auto_increment field number assigned
    return mysql_real_escape_string($str);
  }
  
  function halt($msg) {
    $this->errdesc=mysql_error();
    $this->errno=mysql_errno();
    // prints warning message when there is an error

    if ($this->reporterror==1) {
      $message="Database error in $this->appname: $msg\n";
      $message.="mysql error: $this->errdesc\n";
      $message.="mysql error number: $this->errno\n";
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
	 throw new Exception('Во время выполнения запроса к базе данных произошла ошибка.');
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
	function create_user($user,$server,$pwd) {
		$q = sprintf('CREATE USER %s IDENTIFIED BY "%s"',
			get_full_user_name($user,$server),$pwd);
		$this->query($q);
	}
	function delete_user($user,$server) {
		$full_name = get_full_user_name($user,$server);
		$this->query('DROP USER '.$full_name);
	}
	function grant($user,$server,$obj,$privileges){
	/*
		$this->query(sprintf('GRANT %s ON %s TO %s',
			$privileges,
			$obj,
			get_full_user_name($user,$server)
			));
			*/
echo sprintf('GRANT %s ON %s TO %s',
			$privileges,
			$obj,
			get_full_user_name($user,$server)
			);			
	}
	function flush_privileges(){
		$this->query('FLUSH PRIVILEGES');
	}

}
?>
