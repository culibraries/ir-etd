<?php

class ArchiveModel {

	protected $files;

	public function __construct($files) {
		$this->files = $files;
	}

	public function getOldestFile() {
		return $this->files[2];
	}

}

?>