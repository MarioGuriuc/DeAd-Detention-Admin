<?php

//Author: Mario Guriuc

declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_response('Method not allowed', 405);
}

$database = get_db_conn();
$detention_centers = $database->selectCollection('centers');

$cursor = $detention_centers->find();
$centers = iterator_to_array($cursor);

send_centers_count(count($centers));
