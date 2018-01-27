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
} catch (\Exception $e) {
	die('Connection error:'.$e->getMessage());
}

// init header
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
