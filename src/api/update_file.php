<?php
require_once __DIR__.'/tools/init.php';

requestShouldBe('post');

// allow authorized users only
setRestrictedAccess();

$params = receiveParams(
	$__params = ['file_id', 'name'],
	$__required = ['file_id', 'name']
);
$data = dbRow('
	SELECT id
	FROM files
	WHERE id = :file_id AND user_id = :user_id
	LIMIT 1',
	['file_id' => $params['file_id'], 'user_id' => getUserId()]
);
if (!$data) {
	_exit('file does not exist');
}

$res = dbExec('UPDATE files SET name = :name WHERE id = :file_id', [
    'file_id' => $params['file_id'],
    'name' => $params['name'],
]);
if (!$res) {
	_exit('cannot update file');
}

_success();
