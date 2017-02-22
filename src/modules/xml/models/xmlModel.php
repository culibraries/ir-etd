<?php
// models content of an xml file
class XmlModel {

	protected $file;

	public function __construct($file) {
		$this->file = $file;
	}

	public function sendJson() {
		return json_encode($this->file);
	}
}

?> 