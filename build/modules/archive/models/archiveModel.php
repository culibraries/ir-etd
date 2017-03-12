<?php
// models one archive

require_once($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');
require(MODULES_PATH . '/archive/models/submissionModel.php');

class ArchiveModel {

	public function __construct($archive, $id, $status) {
		global $config;
		$this->archiveName = $archive;
		$this->archivePath = $config['dir']['working'] . $archive;
		$this->archiveUrl = $config['dir']['dataRoot'] . '/working/' . $archive . '/';
		$this->archiveId = $id;
		$this->archiveStatus = $status;
	}

	public function getOneArchive() {
		global $config;

		if (!$this->archiveId) {
			// return properties of archive
			$response = array(
				'name' => $this->archiveName,
				'contents' => scandir($this->archivePath),
				'archiveUrl' => $this->archiveUrl,
				'status' => 'W',
				'readyUrl' => $config['dir']['readyUrl'],
				'json' => $this->getJson()
			);
			return json_encode($response);
		} else {
			$submission = new SubmissionModel();

			$response = array(
				'name' => $this->archiveName,
				'contents' => scandir($this->archivePath),
				'archiveUrl' => $this->archiveUrl,
				'db' => $submission->selectOne($this->archiveId)[0],
				'status' => $this->archiveStatus,
				'readyUrl' => $config['dir']['readyUrl'],
				'json' => $this->getJson()
			);
			return json_encode($response);
		}

		
	}

	public function insertFormData($data) {
		parse_str($data, $formDataArray);
		$formDataArray['workflow_status'] = $this->archiveStatus;

		$submission = new SubmissionModel();

		if ($this->archiveStatus === 'W') {
			echo $submission->insert($formDataArray);
		} else {
			echo $submission->update($this->archiveId, $formDataArray);
		}
	}

	private function getJson() {
		global $config;

		$file = glob($config['dir']['working'] . $this->archiveName . '/*.xml');
		$xml = simplexml_load_file($file[0]);
		return json_encode($xml);
	}

}

?>