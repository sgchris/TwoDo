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
	WHERE name like :name 
	ORDER BY date_created desc LIMIT 1', 
	['name' => $params['name']]
);
if ($data) {
	_exit('file already exists');
}

$res = dbExec('insert into files (name) values (:name)', ['name' => $params['name']]);

if (!$res) {
	_exit('cannot create file');
}

_success();
