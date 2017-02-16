<?php
include($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');
include(MODULES_PATH . '/archive/models/archiveModel.php');

$files = scandir($config['data_dir']);

$archive = new ArchiveModel($files);

if (isset($_GET['action'])) {
	switch ($_GET['action']) {
		case 'getOldestArchive':
			$archive->getOldestArchive();
			break;
	}
}

if (isset($_POST['action'])) {
	switch ($_POST['action']) {
		case 'selectArchive':
			$archive->extractZip($config['data_dir'], $config['working_dir'], $_POST['file']);
			break;
	}
	
}

?>