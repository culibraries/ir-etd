<?php
/**
 * SubmissionModel
 *
 * @author    Fred Schumacher <fred.schumacher@colorado.edu>
 * @version   1.0.0 Initial release
 * @copyright Copyright (c) 2017 University Libraries, CU Boulder
 */

 /**
 * Represents an ETD submission
 */
require_once($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');

class SubmissionModel
{
	private $conn; // connection to the MySQL database
	private $db;   // database instance itself

	private $sequence_num;
	private $title;
	private $fulltext_url;
	private $keywords;
	private $abstract;
	private $author1_fname;
	private $author1_mname;
	private $author1_lname;
	private $author1_suffix;
	private $author1_email;
	private $author1_institution;
	private $advisor1;
	private $advisor2;
	private $advisor3;
	private $advisor4;
	private $advisor5;
	private $disciplines;
	private $comments;
	private $degree_name;
	private $department;
	private $document_type;
	private $embargo_date;
	private $publication_date;
	private $season;
	private $workflow_status;
	private $identikey;

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
	 * insertItem
	 *
	 * Inserts the next ETD item into the database. Parameter represents
	 * all of the form field items that eventually will need to be loaded
	 * into CU Scholar.
	 */
	public function insertItem($values)
	{
		$this->assignValues($values);

		$sql = "INSERT INTO submission
		        VALUES (
						NULL,
				    '$this->sequence_num',
				    '$this->title',
				    '$this->fulltext_url',
				    '$this->keywords',
				    '$this->abstract',
				    '$this->author1_fname',
				    '$this->author1_mname',
				    '$this->author1_lname',
				    '$this->author1_suffix',
				    '$this->author1_email',
				    '$this->author1_institution',
				    '$this->advisor1',
				    '$this->advisor2',
				    '$this->advisor3',
				    '$this->advisor4',
				    '$this->advisor5',
				    '$this->disciplines',
				    '$this->comments',
				    '$this->degree_name',
				    '$this->department',
				    '$this->document_type',
				    '$this->embargo_date',
				    '$this->publication_date',
				    '$this->season',
				    '$this->workflow_status',
				    '$this->identikey',
				    CURRENT_TIMESTAMP,
				    CURRENT_TIMESTAMP)";

    // Method returns an array with the query result (true or false),
		// id of the inserted record, and error message, if applicable
		$result = array(
			'success' => $this->db->query($sql),
			'id' => $this->db->insert_id,
			'error' => $this->db->error
		);
		return json_encode($result);
	}

  /**
	 * updateItem
	 *
	 * Updates database record with id based.
	 */
	public function updateItem($id, $values)
	{
		$this->assignValues($values);

		$sql = "UPDATE submission SET
						title = '$this->title',
			      fulltext_url = '$this->fulltext_url',
			      keywords = '$this->keywords',
			      abstract = '$this->abstract',
	          author1_fname = '$this->author1_fname',
	          author1_mname = '$this->author1_mname',
      			author1_lname = '$this->author1_lname',
	          author1_suffix = '$this->author1_suffix',
	          author1_email = '$this->author1_email',
	          author1_institution = '$this->author1_institution',
	          advisor1 = '$this->advisor1',
	          advisor2 = '$this->advisor2',
			      advisor3 = '$this->advisor3',
			      advisor4 = '$this->advisor4',
			      advisor5 = '$this->advisor5',
			      disciplines = '$this->disciplines',
			      comments = '$this->comments',
			      degree_name = '$this->degree_name',
			      department = '$this->department',
			      document_type = '$this->document_type',
			      embargo_date = '$this->embargo_date',
			      publication_date = '$this->publication_date',
			      season = '$this->season',
			      workflow_status = '$this->workflow_status',
			      identikey = '$this->identikey'
			      WHERE submission_id = $id";

    // Method returns query result and error message, if applicable
		$result = array(
			'success' => $this->db->query($sql),
			'error' => $this->db->error
		);
		return json_encode($result);
	}

  /**
	 * selectWorkingItems
	 *
	 * Selects items from the database that have not been uploaded to
	 * CU Scholar. Status can be any one of working (W), problem (L),
	 * or pending (P) -- batched (B) items are excluded.
	 */
	function selectWorkingItems()
	{
		$sql = "SELECT workflow_status, sequence_num, identikey, submission_id
		        FROM submission
						WHERE workflow_status <> 'B'
						ORDER BY workflow_status";

		$result = $this->db->query($sql);

    // Prepare query result as a dataset and return
		$dataset = array();
		while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
			$dataset[] = $row;
		}
		return json_encode($dataset);
	}

  /**
	 * selectOne
	 *
	 * Selects one item from the database for a given id.
	 */
	function selectOne($id)
	{
		$sql = "SELECT * FROM submission WHERE submission_id = $id";

		$result = $this->db->query($sql);

    // Prepare query result as a dataset and return
		$dataset = array();
		while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
			$dataset = $row;
		}
		return json_encode($dataset);
	}

  /**
	 * createBatch
	 *
	 * Creates export files containing all database items that are pending
	 * batch upload to CU Scholar.
	 */
	function createBatch()
	{

		$sql = "SELECT s.title, s.fulltext_url, s.keywords, s.abstract, s.author1_fname,
			s.author1_mname, s.author1_lname, s.author1_suffix, s.author1_email,
			s.author1_institution, s.advisor1, s.advisor2, s.advisor3, s.advisor4, s.advisor5,
			s.disciplines, s.comments, d.degree_name_long AS degree_name, s.department, s.document_type, s.embargo_date,
			s.publication_date, s.season
			FROM submission s
			INNER JOIN degree_name_ref d
			ON s.degree_name = d.degree_name_short
			WHERE workflow_status = 'P'";

		$result = $this->db->query($sql);

		// Prepare query result as a dataset
		$dataset = array();

		if (!$this->db->error) {
			while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
					$dataset[] = $row;
			}
			// Export the result to an XML file
			require_once(MODULES_PATH . '/export/php-export-data.php');
			$dt = date('Ymd', time());
			$export = new ExportDataExcel('browser', 'etd-batch-' . $dt . '.xml');
			$export->initialize();
			$export->addRow(array_keys($dataset[0]));
			$export->addRow($dataset[0]);
			$export->finalize();
			// Update the pending records to reflect that they are now batched
			// $sql = "UPDATE submission
			//         SET workflow_status = 'B'
			// 			WHERE workflow_status = 'P'";
			// $this->db->query($sql);
		} else {
			echo 'error: ' . $this->db->error;
		}


	}

	/**
	 * assignValues
	 *
	 * Utility method that assigns post values to their corresponding class
	 * properties.
	 */
	private function assignValues($values)
	{
		$this->sequence_num = $values['sequence_num'];
		$this->title = $values['title'];
		$this->fulltext_url = $values['fulltext_url'];
		$this->keywords = $values['keywords'];
		$this->abstract = $this->db->escape_string($values['abstract']);
		$this->author1_fname = $values['author1_fname'];
		$this->author1_mname = $values['author1_mname'];
		$this->author1_lname = $values['author1_lname'];
		$this->author1_suffix = $values['author1_suffix'];
		$this->author1_email = $values['author1_email'];
		$this->author1_institution = $values['author1_institution'];
		$this->advisor1 = $values['advisor1'];
		$this->advisor2 = $values['advisor2'];
		$this->advisor3 = $values['advisor3'];
		$this->advisor4 = $values['advisor4'];
		$this->advisor5 = $values['advisor5'];
		$this->disciplines = $values['disciplines'];
		$this->comments = $values['comments'];
		$this->degree_name = $values['degree_name'];
		$this->department = $values['department'];
		$this->document_type = $values['document_type'];
		$this->embargo_date = $values['embargo_date'];
		$this->publication_date = $values['publication_date'];
		$this->season = $values['season'];
		$this->workflow_status = $values['workflow_status'];
		$this->identikey = $values['identikey'];
	}
}
?>
