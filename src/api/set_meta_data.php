<?php

require_once __DIR__.'/tools/init.php';

requestShouldBe('post');

// allow read data for authorized users only
setRestrictedAccess();

$params = receiveParams(
	$__params = ['key', 'value'],
	$__required = ['key', 'value']
);


$res = dbExec('
    REPLACE INTO metadata (key, value, user_id) values (:key, :value, :user_id)',
    ['value' => $params['value'], 'key' => $params['key'], 'user_id' => getUserId()]);

if (!$res) {
    _exit('Cannot update meta data');
}

_success(['value' => $params['value']]);
