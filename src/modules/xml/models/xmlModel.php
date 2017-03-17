<?php
// models content of an xml file

require_once($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');

class XmlModel {

	protected $file;

	public function __construct($file) {
		$this->file = $file;
	}

	public function sendJson() {
		global $config;
		
		return json_encode($this->file);
	}
}

?> 