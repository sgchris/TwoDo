<?php

require_once __DIR__.'/tools/init.php';

requestShouldBe('get');

$params = receiveParams(
	$__params = ['file_id'],
	$__required = ['file_id']
);

// get latest version
$data = dbRow('
	SELECT f.id, f.name, fv.content, fv.date_created
	FROM files f
		LEFT JOIN files_versions fv ON fv.file_id = f.id
	WHERE f.id = :file_id
	ORDER BY fv.date_created DESC
	LIMIT 1',
	['file_id' => $params['file_id']]
);

if (!$data) {
	_exit('File not found');
}

// fix the data
if (!$data['content']) $data['content'] = '';
if (!$data['date_created']) $data['date_created'] = '';

_success(['data' => $data]);
