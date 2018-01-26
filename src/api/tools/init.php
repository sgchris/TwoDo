<?php

require_once __DIR__.'/functions.php';

// create connection
try {
	$db = new PDO('sqlite:twodo.db');
	if (!$db) {
		die('Connection error');
	}
} catch (\Exception $e) {
	die($e->getMessage());
}

// init header
header('Content-Type: application/json');
