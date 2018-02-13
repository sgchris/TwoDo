<?php

require_once __DIR__.'/tools/init.php';

requestShouldBe('get');

// allow read data for authorized users only
setRestrictedAccess();

$params = receiveParams(
	$__params = ['key'],
	$__required = ['key']
);

$row = dbRow('
    SELECT value FROM metadata WHERE key = :key AND user_id = :user_id
', ['key' => $params['key'], 'user_id' => getUserId()]);
if (!$row) {
    _exit('Cannot get meta data row');
}

_success(['value' => $row['value']]);
