<?php


//Author: Mario Guriuc

declare(strict_types=1);

require_once "utils.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_response('Method not allowed', 405);
}

$jwt = validate_and_return_jwt();

$database = get_db_conn();
$detention_centers = $database->selectCollection('centers');

$cursor = $detention_centers->find();
$centers = iterator_to_array($cursor);

send_centers_count(count($centers));
