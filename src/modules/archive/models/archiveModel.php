<?php
// models one archive

require($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');

class ArchiveModel {

	public function __construct($archiveName, $folder) {
		global $config;
		$this->archiveName = $archiveName;
		$this->archivePath = $config['dir'][$folder] . $archiveName;
		$this->archiveUrl = $config['dir']['dataRoot'] . $folder . '/' . $archiveName . '/';
	}

	public function getOneArchive() {
		global $config;
		
		// return properties of archive
		$response = array(
			'name' => $this->archiveName,
			'path' => $this->archivePath,
			'contents' => scandir($this->archivePath),
			'archiveUrl' => $this->archiveUrl,
		);
		return json_encode($response);
	}

	public function moveToPending() {
		global $config;

		 return rename($config['dir']['working'] . $this->archiveName . '/', $config['dir']['pending'] . $this->archiveName . '/');
	}

	public function moveToProblems() {
		global $config;

		return rename($config['dir']['working'] . $this->archiveName . '/', $config['dir']['problems'] . $this->archiveName . '/');
	}

}

?>