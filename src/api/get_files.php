<?php

require_once __DIR__.'/tools/init.php';

requestShouldBe('get');

$res = $db->query('select * from files');

_success(['files' => $res->fetchAll()]);
