<?php 
class mySQL{
	var $host;
	var $username;
	var $password;
	var $database;
	public $dbc;

	function __construct()
	{
		$this->host = 'localhost';
		$this->username = '';
		$this->password = '';
		$this->database = 'drawing_board';
		$this->dbc = mysqli_connect($this->host, $this->username, $this->password,$this->database) or die('Error connecting to DB');        
	}

	public function queryRun($sql)
	{
		return mysqli_query($this->dbc, $sql);
	}

	public function fetchArray($sql)
	{        
		$array = mysqli_fetch_array($sql);          
		return $array;
	}
	
	public function fetchAssoc($sql)
	{        
		$array = mysqli_fetch_assoc($sql);          
		return $array;
	}

	public function close()
	{
		return mysqli_close($this->dbc);
	}
}
?>