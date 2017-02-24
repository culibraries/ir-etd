<?php
include($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');
include(MODULES_PATH . '/archive/models/archiveModel.php');

// array of all archive names in data directory
$archives = scandir($config['dir']['data']);

// creates archive object for oldest archive
$oldestArchive = new ArchiveModel($archives[2]);

if (isset($_GET['action'])) {
	switch ($_GET['action']) {
		case 'getOldestArchive':
			echo $oldestArchive->archiveFileName;
			break;
	}
}

if (isset($_POST['action'])) {
	switch ($_POST['action']) {
		case 'loadArchive':
			echo $oldestArchive->extractZip();
			break;
	}
	
}

exit();

?>