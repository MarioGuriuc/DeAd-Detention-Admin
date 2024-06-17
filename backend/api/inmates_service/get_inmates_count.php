<?php

// Author: Vlad

declare(strict_types=1);

require_once "utils.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_response('Method not allowed', 405);
}

$jwt = get_decoded_jwt();

if (!$jwt) {
    send_response('Unauthorized', 401);
}

$database = get_db_conn();
$inmates = $database->selectCollection('inmates');

$center_id = extract_center_id_from_url();

if (!$center_id) {
    send_response('Bad Request: Missing center_id', 400);
}

$inmates_cursor = $inmates->find(['center' => $center_id]);
$inmates_list = iterator_to_array($inmates_cursor);

send_inmates_count(count($inmates_list));
