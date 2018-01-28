<?php

require_once __DIR__.'/functions.php';

// create connection
try {
	$dbFilePath = __DIR__.'/../twodo.db';
	if (!file_exists($dbFilePath)) {
		die('DB file does not exist');
	}

	if (!is_writeable($dbFilePath)) {
		die('DB file does not accessible');
	}
	$db = new PDO('sqlite:'.$dbFilePath);
	if (!$db) {
		die('Connection error');
	}

	$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (\Exception $e) {
	die('Connection error:'.$e->getMessage());
}

// init headers

// temp allow access from all
header('Access-Control-Allow-Origin: *');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding');
header('Access-Control-Allow-Methods: POST, GET');

header('Content-Type: application/json');
