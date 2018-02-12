<?php

require_once __DIR__.'/tools/init.php';

requestShouldBe('get');

// allow authorized users only
setRestrictedAccess();

$files = dbQuery('
    SELECT f.id, f.name, LENGTH(fv.content) as size
    FROM files f
        LEFT JOIN files_versions fv ON fv.file_id = f.id
    WHERE f.user_id = :user_id
    GROUP BY f.id
    ORDER BY f.date_created ASC, fv.date_created DESC
', ['user_id' => getUserId()]);

_success(['files' => $files]);
