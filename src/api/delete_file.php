<?php
require_once __DIR__.'/tools/init.php';

requestShouldBe('post');

// allow authorized users only
setRestrictedAccess();

$params = receiveParams(
	$__params = ['file_id'],
	$__required = ['file_id']
);
$data = dbRow('
	SELECT id
	FROM files
	WHERE id = :file_id AND user_id = :user_id
	LIMIT 1',
	['file_id' => $params['file_id'], 'user_id' => getUserId()]
);
if (!$data) {
	_exit('file does not exist');
}

$db->beginTransaction();
try {
    $res = dbExec('DELETE FROM files WHERE id = :file_id', ['file_id' => $params['file_id']]);
    $res = dbExec('DELETE FROM files_versions WHERE file_id = :file_id', ['file_id' => $params['file_id']]);
    $db->commit();
} catch (\Exception $e) {
    $db->rollback();
    _exit('could not delete the file');
}

_success();
