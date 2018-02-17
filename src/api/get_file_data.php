<?php

require_once __DIR__.'/tools/init.php';

requestShouldBe('get');

// allow authorized users only
setRestrictedAccess();

$params = receiveParams(
	$__params = ['file_id', 'version_id'],
	$__required = ['file_id']
);

// check version_id parameter
$versionCondition = '';
$sqlParamValues = ['file_id' => $params['file_id'], 'user_id' => getUserId()];
if (isset($params['version_id']) && !empty($params['version_id'])) {
 	if (!is_numeric($params['version_id'])) {
		_exit('version_id is not numeric');
	}

	$versionCondition = ' AND fv.id = :version_id';
	$sqlParamValues['version_id'] = $params['version_id'];
}

// get latest version
$sql = '
	SELECT f.id, f.name,
		IFNULL(fv.content, "") as content,
		IFNULL(fv.date_created, 0) as date_created
	FROM files f
		LEFT JOIN files_versions fv
			ON fv.file_id = f.id '.$versionCondition.'
	WHERE f.id = :file_id AND f.user_id = :user_id
	ORDER BY fv.date_created DESC
	LIMIT 1';
$data = dbRow($sql, $sqlParamValues);
if (!$data) {
	_exit('File not found');
}

$totalVersions = dbRow('SELECT COUNT(1) AS total_versions FROM files_versions WHERE file_id = :file_id', [
	'file_id' => $params['file_id']
]);
if ($totalVersions === false) {
	_exit('cannot calculate total versions of the file');
}
$data['total_versions'] = $totalVersions['total_versions'];

// get versions list from the first (index:0) to the last (index:len-1)
$versionsList = dbQuery('
	SELECT id, date_created
	FROM files_versions
	WHERE file_id = :file_id
	ORDER BY date_created DESC
	LIMIT 50', [
		'file_id' => $params['file_id'],
	]
);

_success(['data' => $data, 'versions' => $versionsList]);
