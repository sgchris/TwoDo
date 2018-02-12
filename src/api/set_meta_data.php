<?php

require_once __DIR__.'/tools/init.php';

requestShouldBe('post');

// allow read data for authorized users only
setRestrictedAccess();

$params = receiveParams(
	$__params = ['key', 'value'],
	$__required = ['key', 'value']
);


$row = dbExec('
    REPLACE INTO metadata SET 
        value = :value 
    WHERE 
        key = :key AND 
        user_id = :user_id', 
    ['key' => $params['key'], 'value' => $params['value'], 'user_id' => getUserId()]);
if ($row) {
    _exit('Cannot update meta data');
}

_success(['value' => $row['value']]);
