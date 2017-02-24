<?php
include($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');
include(MODULES_PATH . '/archive/models/archiveModel.php');

// array of all archive names in data directory
$archives = array_values(preg_grep('/\.(zip)$/', scandir($config['dir']['data'])));

// creates archive object for oldest archive, array is sorted so oldest is first
$oldestArchive = new ArchiveModel($archives[0]);

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