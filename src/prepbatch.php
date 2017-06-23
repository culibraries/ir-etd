<?php
require_once($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');

    if( ! ini_get('date.timezone') ) {
        date_default_timezone_set('America/Denver');
    }

    require_once('./modules/archive/models/submissionModel.php');

    $submission = new SubmissionModel();

    $submission->createBatch($config['uid']);

?>
