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
class SubmissionModel
{
	private $conn;
	private $db;

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

	public function __construct()
	{
		global $config;
		require(MODULES_PATH . '/archive/models/connectionModel.php');
		$this->db = new ConnectionModel($config['db']);
		$this->conn = $this->db->open();
	}

	public function __destruct()
	{
		$this->db->close();
	}

	public function insert($values)
	{
		$this->assignValues($values);

		$sql = "INSERT INTO submission VALUES (
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
				NULL,
				NULL,
				'$this->identikey')";

		$response = array(
			'success' => $this->conn->query($sql),
			'id' => $this->conn->insert_id,
			'error' => $this->conn->error
		);

		return json_encode($response);
	}

	function update($id, $values)
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

		$response = array(
			'success' => $this->conn->query($sql),
			'error' => $this->conn->error
		);

		return json_encode($response);
	}

	function select()
	{
		$sql = "SELECT workflow_status, sequence_num, identikey, submission_id FROM submission WHERE workflow_status != 'R'";
		$result = $this->conn->query($sql);

		$res = array();

		while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
			$res[] = $row;
		}

		return json_encode($res);

	}

	function selectOne($id)
	{
		$sql = "SELECT * FROM submission WHERE submission_id = $id";

		$result = $this->conn->query($sql);

		$res = array();

		if ($result) {
			while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
				$res[] = $row;
			}

			return $res;
		} else {
			return $this->conn->error;
		}

	}

	private function assignValues($values)
	{
		$this->sequence_num = $values['sequence_num'];
		$this->title = $values['title'];
		$this->fulltext_url = $values['fulltext_url'];
		$this->keywords = $values['keywords'];
		$this->abstract = $this->conn->escape_string($values['abstract']);
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
