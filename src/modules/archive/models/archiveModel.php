<?php
// models one archive

include($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');

class ArchiveModel {

	protected $inPath, $outPath, $archive;
 
	public function __construct($archive) {
		$this->archive = $archive;
	}

	public function getOldestArchive() {
		return $this->archive;
	}

	public function extractZip($inPath, $outPath) {
		global $config;
		$archiveFolderName = substr("$this->archive", 0, -4);
		$archiveFullPath = $outPath . $archiveFolderName . '/';
		$zip = new ZipArchive();
		if ($zip->open($inPath . $this->archive) === true) {
			$zip->extractTo($archiveFullPath);
			$zip->close();
			// return files in unzipped archive
			$response = array(
				'folder' => $archiveFolderName,
				'folderContents' => scandir($archiveFullPath),
				'root' => $config['client_working_dir']
			);
			return json_encode($response);
		} else {
			return 'file extraction failed';
		}
	}

}

?>