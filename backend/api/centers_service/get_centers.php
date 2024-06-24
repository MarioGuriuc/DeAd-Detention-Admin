<?php

//Author: Mario Guriuc

declare(strict_types=1);

require_once "utils.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_response('Method not allowed', 405);
}

$database = get_db_conn();
$detention_centers = $database->selectCollection('centers');

$cursor = $detention_centers->find();

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
