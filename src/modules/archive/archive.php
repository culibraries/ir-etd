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
		case 'getOneArchive':

			switch ($_GET[status]) {
				case 'oldest':
					$archive = new ArchiveModel(extractZip(getOldestArchive()), 'working');
					echo $archive->getOneArchive();
					break;
				case 'working':
					$archive = new ArchiveModel($_GET['archive'], 'working');
					echo $archive->getOneArchive();
					break;
				case 'pending':
					$archive = new ArchiveModel($_GET['archive'], 'pending');
					echo $archive->getOneArchive();
					break;
				case 'problems':
					$archive = new ArchiveModel($_GET['archive'], 'problems');
					echo $archive->getOneArchive();
					break;
			}

			break;
	}
}

if (isset($_POST['action'])) {
	switch ($_POST['action']) {
		case 'postFormData':
			$archive = new ArchiveModel($_POST['archive'], $_POST['status']);
			echo $archive->insertFormData($_POST['data']);
			break;
	}

}

// finds oldest archive in ftp dir and creates archive object
function getOldestArchive() {
	global $config;
	// array of all archive names in data directory
	$archives = array_values(preg_grep('/\.(zip)$/', scandir($config['dir']['ftp'])));
	// oldest is first
	// $oldestArchive = substr("$archives[0]", 0, -4);
	return $archives[0];
}

function extractZip($archive) {
	global $config;

	$archiveFolder = substr("$archive", 0, -4);

	$zip = new ZipArchive();

	if ($zip->open($config['dir']['ftp'] . $archive) === true) {
		$zip->extractTo($config['dir']['working'] . $archiveFolder);
		$zip->close();
		rename($config['dir']['ftp'] . $archive, $config['dir']['archive'] . $archive);
		return $archiveFolder;
	} else {
		return 'zip extract failed';
	}
}

function getArchives() {
	global $config;
	// get all records from database not marked ready ????????????????????????????????????

	$res = array(
		'working' => $working,
		'problems' => $problems,
		'pending' => $pending
	);
	return json_encode($res);
}

exit();

?>
