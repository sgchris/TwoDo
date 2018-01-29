<?php
require_once __DIR__.'/tools/init.php';

requestShouldBe('post');

$params = receiveParams(
	$__params = ['file_id', 'name'],
	$__required = ['file_id', 'name']
);
$data = dbRow('
	SELECT id
	FROM files
	WHERE id like :file_id
	LIMIT 1',
	['file_id' => $params['file_id']]
);
if (!$data) {
	_exit('file does not exist');
}

$res = dbExec('update files set name = :name where id = :file_id', [
    'file_id' => $params['file_id'],
    'name' => $params['name'],
]);
if (!$res) {
	_exit('cannot update file');
}

_success();
