<?php
// modesl content of an xml file
class XmlModel {

	protected $file;

	public function __construct($file) {
		$this->file = $file;
	}

	public function sendXml() {
		return json_encode($this->file);
	}
}

?> 