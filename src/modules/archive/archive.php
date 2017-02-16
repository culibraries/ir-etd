<?php
include($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');
include(MODULES_PATH . '/archive/models/archiveModel.php');

$files = scandir($config['data_dir']);

$archive = new ArchiveModel($files[2]);

if (isset($_GET['action'])) {
	switch ($_GET['action']) {
		case 'getOldestArchive':
			echo $archive->getOldestArchive();
			break;
	}
}

if (isset($_POST['action'])) {
	switch ($_POST['action']) {
		case 'selectArchive':
			echo $archive->extractZip($config['data_dir'], $config['working_dir']);
			break;
	}
	
}

?>