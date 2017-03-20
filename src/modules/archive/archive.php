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
			$oldestArchive = json_decode(getOldestArchive(), true);
			$archive = new ArchiveModel(extractZip($oldestArchive['oldestArchive']), null, 'W');
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
		case 'prepBatch':
			// ???????????????????????????????????????????????????
	}

}

// finds oldest archive in ftp dir and creates archive object
function getOldestArchive() {
	global $config;

	// array of all zip archives in ftp dir
	$archives = glob($config['dir']['ftp'] . '*.zip');

	// if ftp dir not empty
	if ($archives) {
		$oldestArchiveArray = explode('/',$archives[0]);
		$response = array(
			'numArchives' => sizeof($archives),
			'oldestArchive' => $oldestArchiveArray[sizeof($oldestArchiveArray) - 1]
		);
	} else {
		$response = array(
			'numArchives' => false
		);
	}

	return json_encode($response);


	// return json_encode($archives);
	// $archiveArray = iterator_to_array(
	// 	new GlobIterator($config['dir']['ftp'] . '*.zip', )
	// )
	
	// array of all archive names in data directory
	// $archives = array_values(preg_grep('/\.(zip)$/', scandir($config['dir']['ftp'])));
	// oldest is first
	// return $archives[0];
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
	$res = $submission->select();

	return $res;
}

function insertFormData($data, $id) {
	parse_str($data, $formDataArray);

	$submission = new SubmissionModel();

	if (!$id) {
		echo $submission->insert($formDataArray);
	} else {
		echo $submission->update($id, $formDataArray);
	}
}

exit();

?>
