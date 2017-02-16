<?php
include($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');

class ArchiveModel {

	protected $inPath, $outPath, $files;
 
	public function __construct($files) {
		$this->files = $files;
	}

	public function getOldestArchive() {
		echo $this->files[2];
	}

	public function extractZip($inPath, $outPath, $file) {
		$zip = new ZipArchive();
		if ($zip->open($inPath . $file) === true) {
			$zip->extractTo($outPath . substr("$file", 0, -4) . '/');
			$zip->close();
			echo 'ok';
		} else {
			echo 'failed';
		}
	}

}

?>