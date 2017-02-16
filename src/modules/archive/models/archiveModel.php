<?php
// models one archive file path
class ArchiveModel {

	protected $inPath, $outPath, $archive;
 
	public function __construct($archive) {
		$this->archive = $archive;
	}

	public function getOldestArchive() {
		return $this->archive;
	}

	public function extractZip($inPath, $outPath) {
		$zip = new ZipArchive();
		if ($zip->open($inPath . $this->archive) === true) {
			$zip->extractTo($outPath . substr("$this->archive", 0, -4) . '/');
			$zip->close();
			return "file $this->archive extracted";
		} else {
			return 'file extraction failed';
		}
	}

}

?>