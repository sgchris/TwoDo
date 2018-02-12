<?php

require_once __DIR__.'/tools/init.php';

requestShouldBe('get');

// allow authorized users only
setRestrictedAccess();

$params = receiveParams(
	$__params = ['file_id', 'content'], 
	$__required = ['file_id', 'content']
);

// check that the file exists
$data = dbRow('
	SELECT id
	FROM files 
	WHERE id = :file_id AND user_id = :user_id', 
	['file_id' => $params['file_id'], 'user_id' => getUserId()]
);
if (!$data) {
	_exit('file not found');
}

// insert new version
$res = dbQuery('
	SELECT id, date_created 
	FROM files_versions 
	WHERE file_id = :file_id',
	[ 'file_id' => $params['file_id'], ]
);

if (!$res) {
	_exit('cannot get file versions');
}

_success(['versions' => $res]);

