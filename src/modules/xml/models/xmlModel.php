<?php
// models content of an xml file

require($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');

class XmlModel {

	protected $file;

	public function __construct($file) {
		$this->file = $file;
	}

	public function sendJson() {
		global $config;
		$data = array(
			'json' => $this->file,
			'readyUrl' => $config['dir']['readyUrl']
		);
		return json_encode($data);
	}
}

?> 