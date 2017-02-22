<?php
// models one archive

include($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');

class ArchiveModel {

	protected $inPath, $outPath, $archive;
 
	public function __construct($archiveFileName) {
		global $config;
		$this->archiveFileName = $archiveFileName;
		$this->archiveName = substr("$archiveFileName", 0, -4);
		$this->archiveDataPath = $config['data_dir'] . $archiveFileName;
		$this->archiveWorkingPath = $config['working_dir'] . $this->archiveName;
	}

	public function extractZip() {
		global $config;
		
		$zip = new ZipArchive();

		if ($zip->open($this->archiveDataPath) === true) {
			$zip->extractTo($this->archiveWorkingPath);
			$zip->close();
			// return files in unzipped archive
			$this->archiveContents = scandir($this->archiveWorkingPath);
			$response = array(
				'folder' => $this->archiveName,
				'folderContents' => $this->archiveContents,
				'url' => $config['working_dir_url']
			);
			return json_encode($response);
		} else {
			return 'file extraction failed';
		}
	}

}

?>