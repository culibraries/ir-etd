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

	private $acceptance;
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
				    'strtolower($this->keywords)',
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
				    CURRENT_TIMESTAMP,
                    '$this->acceptance')";

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
            acceptance = '$this->acceptance',
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
	 * Creates export file containing all database items that are pending
	 * batch upload to CU Scholar.
	 */
	function createBatch($user)
	{
		require_once ($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/phpexcel/PHPExcel.php');

		// Utility function to account for limitations of Excel sheetnames (special chars and length)
		function clean_sheetname($name)
		{
    		$invalid_chars = ['/','\\','*','[',']',':','?'];
    		return trim(substr(str_replace($invalid_chars, ' ', $name), 0, 30));
		}

		// References to worksheet columns
	   $letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O',
				  'P','Q','R','S','T','U','V','W','X','Y','Z','AA','AB','AC'];

    	// Get data for the export files (all items that are pending)
		$sql = "SELECT s.title, s.fulltext_url, s.keywords, s.abstract, s.author1_fname,
			s.author1_mname, s.author1_lname, s.author1_suffix, s.author1_email,
			s.author1_institution, s.advisor1, s.advisor2, s.advisor3, s.advisor4, s.advisor5,
			s.disciplines, s.comments, d.degree_name_long AS degree_name, s.department,
			s.document_type, s.embargo_date, s.publication_date, s.season
			FROM submission s
			INNER JOIN degree_name_ref d
			ON s.degree_name = d.degree_name_short
			WHERE workflow_status = 'P' AND identikey = '$user'
			ORDER BY s.department";

		$result = $this->db->query($sql);

		// Prepare query result
		$dataset = array();
		while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
			$dataset[] = $row;
		}

		// Get a unique set of departments (needed for controlling the
		// outermost processing loop)
		$depts = array_unique(array_column($dataset, 'department'));

		// Instantiate a new Excel object
		$excel = new PHPExcel();

		// Start the outermost loop
		$n = 0; // Worksheet index
		foreach ($depts as $d) {

			// Add a new worksheet representing the current department
			// Note that max length of a worksheet name is 31 characters and
			// there are 7 characters that cannot be used in the name
			$ds = clean_sheetname($d);
			$wks = new PHPExcel_Worksheet($excel, $ds);
			$excel->addSheet($wks, ++$n);

			// Write the header row for the current worksheet
			$cols = array_keys($dataset[0]);
		    for ($i = 0; $i < count($cols); $i++) {
				$excel->getSheetByName($ds)->setCellValue($letters[$i] . '1', $cols[$i]);
		  }

			// Write the data for the current department only
			$r = 2; // Current row index
			for ($row = 0; $row < count($dataset); $row++) {
				if ($dataset[$row]['department'] == $d) {
				  for ($col = 0; $col < count($cols); $col++) {
					  $excel->getSheetByName($ds)->setCellValue($letters[$col] . $r,
							array_values($dataset[$row])[$col]);
				  }
					$r++;
				}
			}
		}

		// remove worksheet 0 as it was not used
		$excel->removeSheetByIndex(0);

		// download file
		$file = 'etd-batch-' . date('Ymd', time()) . '.xls';
		header('Content-Type: application/vnd.ms-excel');
		header('Content-Disposition: attachment; filename="' . $file . '"');
		header('Cache-Control: max-age=0');
		$writer = PHPExcel_IOFactory::createWriter($excel, 'Excel5');
		$writer->save('php://output');

		// Update the workflow status for the records just batched
    	$this->updateBatch($user);
	}

	/**
	 * updateBatch
	 *
	 * Sets workflow status to 'B' for all batched items
	 */
  private function updateBatch($user)
  {
    $sql = "UPDATE submission
            SET workflow_status = 'B'
            WHERE workflow_status = 'P' AND identikey='$user'";
    $this->db->query($sql);
  }

	/**
	 * assignValues
	 *
	 * Utility method that assigns post values to their corresponding class
	 * properties.
	 */
	private function assignValues($values)
	{
        $this->acceptance = $this->db->escape_string($values['acceptance']);
		$this->sequence_num = $this->db->escape_string($values['sequence_num']);
		$this->title = $this->db->escape_string($values['title']);
		$this->fulltext_url = $this->db->escape_string($values['fulltext_url']);
		$this->keywords = $this->db->escape_string($values['keywords']);
		$this->abstract = $this->db->escape_string($values['abstract']);
		$this->author1_fname = $this->db->escape_string($values['author1_fname']);
		$this->author1_mname = $this->db->escape_string($values['author1_mname']);
		$this->author1_lname = $this->db->escape_string($values['author1_lname']);
		$this->author1_suffix = $this->db->escape_string($values['author1_suffix']);
		$this->author1_email = $this->db->escape_string($values['author1_email']);
		$this->author1_institution = $this->db->escape_string($values['author1_institution']);
		$this->advisor1 = $this->db->escape_string($values['advisor1']);
		$this->advisor2 = $this->db->escape_string($values['advisor2']);
		$this->advisor3 = $this->db->escape_string($values['advisor3']);
		$this->advisor4 = $this->db->escape_string($values['advisor4']);
		$this->advisor5 = $this->db->escape_string($values['advisor5']);
		$this->disciplines = $this->db->escape_string($values['disciplines']);
		$this->comments = $this->db->escape_string($values['comments']);
		$this->degree_name = $this->db->escape_string($values['degree_name']);
		$this->department = $this->db->escape_string($values['department']);
		$this->document_type = $this->db->escape_string($values['document_type']);
		$this->embargo_date = $this->db->escape_string($values['embargo_date']);
		$this->publication_date = $this->db->escape_string($values['publication_date']);
		$this->season = $this->db->escape_string($values['season']);
		$this->workflow_status = $this->db->escape_string($values['workflow_status']);
		$this->identikey = $this->db->escape_string($values['identikey']);
	}
}
?>
