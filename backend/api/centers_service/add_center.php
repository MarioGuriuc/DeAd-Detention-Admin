<?php

use MongoDB\BSON\Binary;

require_once "utils.php";
require_once "constants.php";

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    send_response("Method not allowed", 405);
}

$jwt = get_decoded_jwt();

if (!$jwt) {
    send_response("Unauthorized", 401);
}

if ($jwt->role !== 'admin') {
    send_response("Unauthorized", 403);
}

$data = receive_json();

$empty_fields = is_data_empty($data, CENTER_REQUIRED_FIELDS);

if ($empty_fields) {
    send_response($empty_fields, 400);
}

if (empty($data['image'])) {
    send_response(CENTER_REQUIRED_FIELDS['image'], 400);
}

validate_center_data($data, CENTER_CHECKS);

$center = [
    'image' => new Binary($data['image']),
    'title' => $data['name'],
    'description' => $data['description'],
    'location' => $data['location']
];

$database = get_db_conn();

$centers_collection = $database->selectCollection('centers');

$result = $centers_collection->insertOne($center);

if (!$result->getInsertedCount()) {
    send_response("Center could not be added", 500);
}

send_response("Center added", 201);
