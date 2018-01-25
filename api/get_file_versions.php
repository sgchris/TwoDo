<?php

require_once __DIR__.'/tools/init.php';

requestShouldBe('get');

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
$res = dbQuery('
	select id, date_created 
	from files_versions 
	where file_id = :file_id',
	[ 'file_id' => $params['file_id'], ]
);

if (!$res) {
	_exit('cannot get file versions');
}

_success(['versions' => $res]);

