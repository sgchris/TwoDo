<?php

require_once __DIR__.'/tools/init.php';

requestShouldBe('post');

$params = receiveParams(
	$__params = ['file_id', 'content'], 
	$__required = ['file_id', 'content']
);

// check that the file exists
$data = dbRow('
	SELECT id
	FROM files 
	WHERE id = :file_id', 
	['file_id' => $params['file_id']]
);
if (!$data) {
	_exit('file not found');
}

// insert new version
$res = dbExec('insert into files_versions (file_id, date_created, content) 
	values (:file_id, :date_created, :content)', 
	[
		'file_id' => $params['file_id'],
		'date_created' => time(),
		'content' => $params['content'],
	]
);

if (!$res) {
	_exit('cannot create file version');
}

_success();
