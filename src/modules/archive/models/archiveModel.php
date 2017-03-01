<?php
// models one archive

include($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');

class ArchiveModel {

	public function __construct($archiveName) {
		global $config;
		// the folder name of the archive
		$this->archiveName = $archiveName;
		$this->archiveWorkingPath = $config['dir']['working'] . $this->archiveName;
		// the zip file name of the archive
		$this->archiveFileName = $archiveName . '.zip';
		$this->archiveDataPath = $config['dir']['data'] . $this->archiveFileName;
	}

	public function extractZip() {
		global $config;
		
		$zip = new ZipArchive();

		if ($zip->open($this->archiveDataPath) === true) {
			$zip->extractTo($this->archiveWorkingPath);
			$zip->close();
			// return files in unzipped archive
			$response = array(
				'folder' => $this->archiveName,
				'folderContents' => scandir($this->archiveWorkingPath),
				'url' => $config['dir']['workingUrl'],
				'readyUrl' => $config['dir']['readyUrl']
			);
			return json_encode($response);
		} else {
			return 'file extraction failed';
		}
	}

	public function moveToPending() {
		global $config;

		 return rename($this->archiveWorkingPath . '/', $config['dir']['pending'] . $this->archiveName . '/');
	}

	public function moveToProblems() {
		global $config;

		return rename($this->archiveWorkingPath . '/', $config['dir']['problems'] . $this->archiveName . '/');
	}

	private function xmlFileName($contents) {
		for ($i = 2; $i < sizeof($contents); $i++) {
			$test = substr($contents[$i], strlen($contents[$i]) - 3);
			if ($test === 'xml') {
				return $contents[$i];
			}
		}
		return 'not found';
	}

}

?>