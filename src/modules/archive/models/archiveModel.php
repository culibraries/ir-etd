<?php
// models one archive

require_once($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');
require(MODULES_PATH . '/archive/models/submissionModel.php');

class ArchiveModel {

	public function __construct($archive, $subId, $status) {
		global $config;
		$this->archiveName = $archive;
		$this->archivePath = $config['dir']['working'] . $archive;
		$this->archiveUrl = $config['dir']['dataRoot'] . '/working/' . $archive . '/';
		$this->archiveSubId = $subId;
		$this->archiveStatus = $status;
	}

	public function getOneArchive() {
		global $config;

		$submission = new SubmissionModel();

		$response = array(
			'name' => $this->archiveName,
			'contents' => scandir($this->archivePath),
			'archiveUrl' => $this->archiveUrl,
			'db' => $submission->selectOne($this->archiveSubId)[0],
			'status' => $this->archiveStatus,
			'readyUrl' => $config['dir']['readyUrl'],
			'json' => $this->getJson(),
			'subId' => $this->archiveSubId
		);
		return json_encode($response);
	}

	public function getExtractOldestArchive() {
		global $config;

		$response = array(
			'name' => $this->archiveName,
			'contents' => scandir($this->archivePath),
			'archiveUrl' => $this->archiveUrl,
			'status' => $this->archiveStatus,
			'readyUrl' => $config['dir']['readyUrl'],
			'json' => $this->getJson()
		);

		return json_encode($response);
	}

	private function getJson() {
		global $config;

		$file = glob($config['dir']['working'] . $this->archiveName . '/*.xml');
		$xml = simplexml_load_file($file[0]);
		return json_encode($xml);
	}

}

?>