<?php
include($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');
include(MODULES_PATH . '/xml/models/xmlModel.php');

// assign the xml file path to $file, in array
$file = glob($config['dir']['working'] . $_GET['archive'] . '/*.xml');

// create new obj from contents of $file
$xml = new XmlModel(simplexml_load_file($file[0]));

// Ajax routes
if (isset($_GET['action'])) {
	switch ($_GET['action']) {
		case 'getJsonFromXml':
			// echo $xml->xml2js();
			echo $xml->sendJson();
			break;
	}
}

?>