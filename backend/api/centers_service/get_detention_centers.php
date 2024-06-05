<?php

//Author: Mario Guriuc

declare(strict_types=1);

require_once "utils.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_response('Method not allowed', 405);
}

$jwt = get_decoded_jwt();

if (!$jwt) {
    //send_response('Unauthorized', 401);
}

$database = get_db_conn();
$detention_centers = $database->selectCollection('centers');

$url = $_SERVER['REQUEST_URI'];

$page_number = $params[0] ?? 1;

if (!is_numeric($page_number) || $page_number < 1) {
    $page_number = 1;
}

$limit = 12;
$skip = ($page_number - 1) * $limit;

$cursor = $detention_centers->find([], [
    'skip' => $skip,
    'limit' => $limit
]);

$centers = [];

foreach ($cursor as $center) {
    $filtered_center = [
        'id' => (string)$center['_id'],
        'image' => $center['image']->getData(),
        'title' => $center['title'],
        'description' => $center['description'],
        'location' => $center['location']
    ];
    $centers[] = $filtered_center;
}

send_response_with_centers($centers);
