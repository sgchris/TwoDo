<?php
require_once __DIR__.'/tools/init.php';

requestShouldBe('post');

// allow authorized users only
setRestrictedAccess();

$params = receiveParams(
	$__params = ['name'],
	$__required = ['name']
);
$data = dbRow('
	SELECT id
	FROM files
	WHERE name LIKE :name AND user_id = :user_id
	LIMIT 1',
	['name' => $params['name'], 'user_id' => getUserId()]
);
if ($data) {
	_exit('file already exists');
}

$res = dbExec('INSERT INTO files (name, user_id, date_created) VALUES (:name, :user_id, :date_created)', [
	'name' => $params['name'],
	'user_id' => getUserId(),
	'date_created' => time(),
]);
if (!$res) {
	_exit('cannot create file');
}

_success(['file_id' => $db->lastInsertId()]);
