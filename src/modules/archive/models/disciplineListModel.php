<?php
/**
 * DisciplineListModel
 *
 * @author    Fred Schumacher <fred.schumacher@colorado.edu>
 * @version   1.0.0 Initial release
 * @copyright Copyright (c) 2017 University Libraries, CU Boulder
 */

 /**
 * Represents a list of valid disciplines
 */
require_once($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');

class DisciplineListModel
{

	private $conn; // connection to the MySQL database
	private $db;   // database instance itself

	private $disciplines; // list of valid disciplines

	/**
	 * constructor
	 *
	 * Establishes a database connection using specified datasource. Database
	 * connection remains open throughout the life of the object.
	 */
	public function __construct()
	{
		global $config;
		require(MODULES_PATH . '/archive/models/connectionModel.php');
		$this->conn = new ConnectionModel($config['db']);
		$this->db = $this->conn->open();

		$this->getDisciplines();
	}

  /**
	 * destructor
	 *
	 * Closes database connection when the object is destroyed.
	 */
	public function __destruct()
	{
		$this->conn->close();
	}

	/**
	 * getDisciplines
	 *
	 * Gets list of disciplines for the reference table.
	 */
	 private function getDisciplines()
	 {
		 $sql = "SELECT * FROM discipline_ref";

		 $result = $this->db->query($sql);
		 $this->disciplines = array();
         if (!$this->db->error) {
             while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
                 $this->disciplines[] = $row["discipline_name"];
             }
         } else {
             echo 'error: ' . $this->db->error;
         }

	 }

	 /**
 	 * isValidDiscipline
 	 *
 	 * Checks the validity of submitted discipline, i.e., is it in
	 * the database. Commas and other punctuation are stripped from
	 * the search term before the check is made.
	 *
	 * returns TRUE or FALSE
 	 */
	 public function isValidDiscipline($discipline)
	 {
		 $discipline = strtolower(str_replace(array(",","'"), "", $discipline));
		 return in_array($discipline, $this->disciplines);
	 }

     public function sendDisciplines() {
         return $this->disciplines;
     }

}
?>
