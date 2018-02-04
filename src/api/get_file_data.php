<?php

require_once __DIR__.'/tools/init.php';

requestShouldBe('get');

$params = receiveParams(
	$__params = ['file_id', 'version_id'],
	$__required = ['file_id']
);

// check version_id parameter
$versionCondition = '';
$sqlParamValues = ['file_id' => $params['file_id']];
if (isset($params['version_id'])) {
 	if (!is_numeric($params['version_id'])) {
		_exit('version_id is not numeric');
	}

	$versionCondition = ' AND fv.id = :version_id';
	$sqlParamValues['version_id'] = $params['version_id'];
}

// get latest version
$data = dbRow('
	SELECT f.id, f.name, fv.content, fv.date_created
	FROM files f
		LEFT JOIN files_versions fv
			ON fv.file_id = f.id '.$versionCondition.'
	WHERE f.id = :file_id
	ORDER BY fv.date_created DESC
	LIMIT 1',
	$sqlParamValues
);
if (!$data) {
	_exit('File not found');
}

$totalVersions = dbRow('select count(1) as total_versions from files_versions where file_id = :file_id', [
	'file_id' => $params['file_id']
]);
if ($totalVersions === false) {
	_exit('cannot calculate total versions of the file');
}
$data['total_versions'] = $totalVersions['total_versions'];

$versionsList = dbQuery('select id, date_created from files_versions order by date_created desc');
_success(['data' => $data, 'versions' => $versionsList]);
