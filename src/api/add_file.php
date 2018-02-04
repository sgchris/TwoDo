<?php
require_once __DIR__.'/tools/init.php';

requestShouldBe('post');

$params = receiveParams(
	$__params = ['name'],
	$__required = ['name']
);
$data = dbRow('
	SELECT id
	FROM files
	WHERE name LIKE :name
	LIMIT 1',
	['name' => $params['name']]
);
if ($data) {
	_exit('file already exists');
}

$res = dbExec('INSERT INTO files (name, date_created) VALUES (:name, :date_created)', [
	'name' => $params['name'],
	'date_created' => time(),
]);
if (!$res) {
	_exit('cannot create file');
}

_success(['file_id' => $db->lastInsertId()]);
