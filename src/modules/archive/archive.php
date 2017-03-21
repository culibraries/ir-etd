<?php
require_once($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');
require(MODULES_PATH . '/archive/models/archiveModel.php');


if (isset($_GET['action'])) {

	switch ($_GET['action']) {
		case 'getOldestArchive':
			echo getOldestArchive();
			break;
		case 'getArchives':
			echo getArchives();
			break;
		case 'getExtractOldestArchive':
			$archive = new ArchiveModel(extractZip(getOldestArchive()), null, 'W');
			echo $archive->getExtractOldestArchive();
			break;
		case 'getOneArchive':
			$archive = new ArchiveModel($_GET['archive'], $_GET['subId'], $_GET['status']);
			echo $archive->getOneArchive();
	}
}

if (isset($_POST['action'])) {
	switch ($_POST['action']) {
		case 'postFormData':
			// $archive = new ArchiveModel($_POST['archive'], $_POST['subId'], $_POST['status']);
			echo insertFormData($_POST['data'], $_POST['subId']);
			break;
	}

}

// finds oldest archive in ftp dir and creates archive object
function getOldestArchive() {
	global $config;
	// array of all archive names in data directory
	$archives = array_values(preg_grep('/\.(zip)$/', scandir($config['dir']['ftp'])));
	// oldest is first
	return $archives[0];
}

function extractZip($archive) {
	global $config;

	// strip .zip and split by '_' and return the last array item or just the sequence num
	$archiveFolder = explode('_', substr("$archive", 0, -4))[2];

	$zip = new ZipArchive();

	if ($zip->open($config['dir']['ftp'] . $archive) === true) {
		$zip->extractTo($config['dir']['working'] . $archiveFolder);
		$zip->close();

		// move zip file to archive dir
		rename($config['dir']['ftp'] . $archive, $config['dir']['archive'] . $archive);

		return $archiveFolder;
	} else {
		return 'zip extract failed';
	}
}

function getArchives() {
	global $config;
	// get all records from database not marked ready
	$submission = new SubmissionModel();
	$res = $submission->selectWorkingItems();

	return $res;
}

function insertFormData($data, $id) {
	parse_str($data, $formDataArray);

	$submission = new SubmissionModel();

	if (!$id) {
		echo $submission->insertItem($formDataArray);
	} else {
		echo $submission->updateItem($id, $formDataArray);
	}
}

exit();

?>
