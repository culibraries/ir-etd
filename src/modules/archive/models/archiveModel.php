<?php
// models one archive

include($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');

class ArchiveModel {

	// protected $inPath, $outPath, $archive;
 

	public function __construct($archiveFileName) {
		global $config;
		$this->archiveFileName = $archiveFileName;
		$this->archiveName = substr("$archiveFileName", 0, -4);
		$this->archiveDataPath = $config['dir']['data'] . $archiveFileName;
		$this->archiveWorkingPath = $config['dir']['working'] . $this->archiveName;
		$this->archiveContents = scandir($this->archiveWorkingPath);
		$this->xmlFileName = $this->xmlFileName($this->archiveContents);
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
				'folderContents' => $this->archiveContents,
				'url' => $config['dir']['workingUrl']
			);
			return json_encode($response);
		} else {
			return 'file extraction failed';
		}
	}

	// private function removeAtFromXml($file) {
	// 	$fileContents = file_get_contents()
	// }

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