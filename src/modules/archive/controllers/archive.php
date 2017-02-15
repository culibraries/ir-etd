<?php
include($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');
include(MODULES_PATH . '/archive/models/archiveModel.php');

$files = scandir($config['data_dir']);

$archive = new ArchiveModel($files);

$oldestFile = $archive->getOldestFile();

// $zip = new ZipArchive;
// if ($zip->open($config['data_dir'] . $oldestFile) === true) {
// 	$zip->extractTo($config['working_dir']);
// 	$zip->close();
// 	echo 'ok';
// } else {
// 	echo 'failed';
// }

?>