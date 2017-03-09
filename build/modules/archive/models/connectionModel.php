<?php
/**
 * ConnectionModel
 *
 * @author    Fred Schumacher <fred.schumacher@colorado.edu>
 * @version   1.0.0 Initial release
 * @copyright Copyright (c) 2017 University Libraries, CU Boulder
 */

 /**
 * Represents a connection to the database server.
 */
class ConnectionModel
{
	private $mysqli;
	private $ds;

	public function __construct($datasource)
	{
		$this->ds = $datasource;
	}

	/**
	 * Open a database connection
	 */
	public function open()
	{
		$this->mysqli = new mysqli(
			$this->ds['hostname'],
			$this->ds['username'],
			$this->ds['password'],
			$this->ds['database']);
		if ($this->mysqli->connect_errno){
			echo $this->mysqli->connect-errno . " " . $this->mysqli->connect-error;
			exit();
		}

		return $this->mysqli;
	}

	/**
	 * Close the current database connection
	 */
	public function close()
	{
		$this->mysqli->close();
	}
}
?>
