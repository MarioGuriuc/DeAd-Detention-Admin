<?php

//Author: Mario Guriuc

declare(strict_types=1);

use MongoDB\BSON\ObjectId;

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_response('Method not allowed', 405);
}

$database = get_db_conn();
$detention_centers = $database->selectCollection('centers');

$center_id = $params['center_id'] ?? '';

if (!is_string($center_id) || !preg_match('/^[0-9a-fA-F]{24}$/', $center_id)) {
    send_response('Invalid center id', 400);
}

$center = $detention_centers->findOne(['_id' => new ObjectId($center_id)]);

if (is_null($center)) {
    send_response('Center not found', 404);
}

$filtered_center = [
    'id' => (string)$center['_id'],
    'image' => $center['image']->getData(),
    'title' => $center['title'],
    'description' => $center['description'],
    'location' => $center['location']
];

send_response_with_center($filtered_center);
