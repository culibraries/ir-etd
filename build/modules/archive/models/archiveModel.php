<?php
// models one archive

require_once($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');
require(MODULES_PATH . '/archive/models/submissionModel.php');

class ArchiveModel {

	public function __construct($archiveName, $status) {
		global $config;
		$this->archiveName = $archiveName;
		$this->archivePath = $config['dir']['working'] . $archiveName;
		$this->archiveUrl = $config['dir']['dataRoot'] . '/working/' . $archiveName . '/';
		$this->archiveStatus = $status;
	}

	public function getOneArchive() {
		global $config;
		
		// return properties of archive
		$response = array(
			'name' => $this->archiveName,
			'path' => $this->archivePath,
			'contents' => scandir($this->archivePath),
			'archiveUrl' => $this->archiveUrl,
			'status' => $this->archiveStatus
		);
		return json_encode($response);
	}

	public function insertFormData($data) {
		parse_str($data, $formDataArray);
		$formDataArray['workflow_status'] = $this->archiveStatus;
		$submission = new SubmissionModel();
		if ($this->archiveStatus === 'W') {
			echo $submission->insert($formDataArray);
		} else {
			echo $submission->update($formDataArray);
		}
	}

	public function updateFormData($data) {
		parse_str($data, $formDataArray);
		$formDataArray['workflow_status'] = $this->archiveStatus;
		$submission = new SubmissionModel();
		echo $submission->update($formDataArray);
	}

}

?>