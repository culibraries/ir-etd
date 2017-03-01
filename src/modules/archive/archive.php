<?php
include($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');
include(MODULES_PATH . '/archive/models/archiveModel.php');


if (isset($_GET['action'])) {
	switch ($_GET['action']) {
		case 'getOldestArchive':
			echo getOldestArchive()->archiveFileName;
			break;
		case 'getArchives':
			echo getArchives();
			break;
	}
}

if (isset($_POST['action'])) {
	switch ($_POST['action']) {
		case 'loadArchive':
			echo getOldestArchive()->extractZip();
			break;
		case 'moveToPending':
			echo 'move to pending';
			$archive = new ArchiveModel($_POST['archive']);
			echo $archive->moveToPending();
			break;
		case 'moveToProblems':
			$archive = new ArchiveModel($_POST['archive']);
			echo $archive->moveToProblems();
			break;
	}
	
}

// gets oldest archive from data dir and creates archive object from 
function getOldestArchive() {
	global $config;
	// array of all archive names in data directory
	$archives = array_values(preg_grep('/\.(zip)$/', scandir($config['dir']['data'])));
	// creates archive object for oldest archive, array is sorted so oldest is first
	$oldestArchive = new ArchiveModel(substr("$archives[0]", 0, -4));
	
	return $oldestArchive;
}

function getArchives() {
	global $config;
	// get all folders excluding .files
	$working = array_values(preg_grep('/^([^.])/', scandir($config['dir']['working'])));
	$problems = array_values(preg_grep('/^([^.])/', scandir($config['dir']['problems'])));
	$pending = array_values(preg_grep('/^([^.])/', scandir($config['dir']['pending'])));

	$res = array(
		'working' => $working,
		'problems' => $problems,
		'pending' => $pending
	);
	return json_encode($res);
}

exit();

?>