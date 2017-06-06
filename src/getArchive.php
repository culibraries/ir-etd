<?php
require_once($_SERVER['DOCUMENT_ROOT'] . '/etd/resources/config.php');

$file = $_GET['file'];
$fileURL = $config['dir']['archive'] . $file;

if (file_exists($fileURL)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename="'.basename($fileURL).'"');
    // header('Content-Transfer-Encoding: binary');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($fileURL));
    readfile($fileURL);
    exit;
} else {
    echo "$fileURL does not exist";
}

?>
