<?php
// for docker dev environment
if (isset($_SERVER['APPLICATION_ENV']) && $_SERVER['APPLICATION_ENV'] === 'docker') {
	$config = array(
		'db' => array(
			'dbName' => 'etd',
			'user' => 'user',
			'password' => 'secret',
			'host' => 'mysql'
		)
	);
// Production environment
} else {
	$config = array(
		'db' => array(
			'dbName' => 'etd',
			'user' => 'user',
			'password' => 'secret',
			'host' => '127.0.0.1'
		)
	);
}

// define paths
define('TEMPLATES_PATH', realpath(dirname(__FILE__) . '/templates'));

?>
