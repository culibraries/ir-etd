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

	public function __construct()
	{
		//require_once('config.php');
		$this->db = new ConnectionModel($config['db']);
		$this->conn = $this->db->open();
	}

	public function __destruct()
	{
		$this->db->close();
	}

	public function insert($values)
	{
		$title = $values['title'];
		$fulltext_url = $values['fulltext_url'];
		$keywords = $values['keywords'];
		$abstract = $values['abstract'];
		$author1_fname = $values['author1_fname'];
		$author1_mname = $values['author1_mname'];
		$author1_lname = $values['author1_lname'];
		$author1_suffix = $values['author1_suffix'];
		$author1_email = $values['author1_email'];
		$author1_institution = $values['author1_institution'];
		$advisor1 = $values['advisor1'];
		$advisor2 = $values['advisor2'];
		$advisor3 = $values['advisor3'];
		$advisor4 = $values['advisor4'];
		$advisor5 = $values['advisor5'];
		$disciplines = $values['disciplines'];
		$comments = $values['comments'];
		$degree_name = $values['degree_name'];
		$department = $values['department'];
		$document_type = $values['document_type'];
		$embargo_date = $values['embargo_date'];
		$publication_date = $values['publication_date'];
		$season = $values['season'];
		$status = $values['status'];
		$identikey = $values['identikey'];

		$sql = "INSERT INTO submission (
				title, fulltext_url, keywords, abstract, author1_fname, author1_mname,
				author1_lname, author1_suffix, author1_email, author1_institution,
				advisor1, advisor2, advisor3, advisor4, advisor5, disciplines,
				comments, degree_name, department, document_type, embargo_date,
				publication_date, season, status, identikey) VALUES (
				'$title', '$fulltext_url', '$keywords', '$abstract', '$author1_fname',
				'$author1_mname', '$author1_lname', '$author1_suffix', '$author1_email',
				'$author1_institution', '$advisor1', '$advisor2', '$advisor3', '$advisor4',
				'$advisor5', '$disciplines', '$comments', '$degree_name', '$department',
				'$document_type', '$embargo_date', '$publication_date', '$season',
				'$status', '$identikey')";
		return $this->conn->query($sql);
	}
}

?>
