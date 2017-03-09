<?php
// for docker dev environment
if (isset($_SERVER['APPLICATION_ENV']) && $_SERVER['APPLICATION_ENV'] === 'docker') {
	$config = array(
		'db' => array(
			'database' => 'etd',
			'username' => 'etd_service',
			'password' => 'cuboulder',
			'hostname' => 'mysql'
		),
		'dir' => array(
			'ftp' => $_SERVER['DOCUMENT_ROOT'] . '/etd/data/ftp/',
			'working' => $_SERVER['DOCUMENT_ROOT'] . '/etd/data/working/',
			'workingUrl' => 'http://docker.dev/etd/data/working/',
			'pending' => $_SERVER['DOCUMENT_ROOT'] . '/etd/data/pending/',
			'problems' => $_SERVER['DOCUMENT_ROOT'] . '/etd/data/problems/',
			'ready' => $_SERVER['DOCUMENT_ROOT'] . '/etd/data/ready/',
			'readyUrl' => 'http://docker.dev/etd/data/ready/',
			'dataRoot' => 'http://docker.dev/etd/data/',
			'archive' => $_SERVER['DOCUMENT_ROOT'] . '/etd/data/archive/'
		),
		'uid' => 'someone'
	);
// Production environment
} else {
	$config = array(
		'db' => array(
			'dbName' => 'etd',
			'user' => 'user',
			'password' => 'secret',
			'host' => '127.0.0.1'
		),
		'dir' => array(
			'ftp' => $_SERVER['DOCUMENT_ROOT'] . '???',
			'working' => $_SERVER['DOCUMENT_ROOT'] . '???',
			'workingUrl' => '????',
			'pending' => '????',
			'problems' => '????',
			'ready' => '????',
			'readyUrl' => '????',
			'dataRoot' => '????',
			'archvie' => '????'
		),
		'uid' => $_SERVER['uid']
	);
}

// define paths
define('TEMPLATES_PATH', realpath(dirname(__FILE__) . '/templates'));
define('MODULES_PATH', $_SERVER['DOCUMENT_ROOT'] . '/etd/modules');

?>

