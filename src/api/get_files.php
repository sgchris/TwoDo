<?php

require_once __DIR__.'/tools/init.php';

requestShouldBe('get');

$res = $db->query('
    SELECT f.id, f.name, LENGTH(fv.content)
    FROM files f
        LEFT JOIN files_versions fv ON fv.file_id = f.id
    GROUP BY f.id
    ORDER BY f.date_created ASC, fv.date_created DESC
');

_success(['files' => $res->fetchAll()]);
