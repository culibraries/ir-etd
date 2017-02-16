<?php
include($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');
include(MODULES_PATH . '/xml/models/xmlModel.php');

$file = glob($config['working_dir'] . $_GET['path'] . '/*.xml');

$xml = new xmlModel(simplexml_load_file($file[0]));

if (isset($_GET['action'])) {
	switch ($_GET['action']) {
		case 'getXmlFile':
			echo $xml->xml2js(simplexml_load_file($file[0]));
			break;
	}
}

?>