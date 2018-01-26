<?php

require_once __DIR__.'/tools/init.php';

requestShouldBe('get');

$params = receiveParams(
	$__params = ['file_id'], 
	$__required = ['file_id']
);

// get latest version
$data = dbRow('
	SELECT content, date_created 
	FROM files_versions 
	WHERE file_id = :file_id 
	ORDER BY date_created desc 
	LIMIT 1', 
	['file_id' => $params['file_id']]
);

if (!$data) {
	_exit('File not found');
}

_success(['data' => $data]);
