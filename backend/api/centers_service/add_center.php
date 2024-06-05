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
$image = null;
if ($data['image']) {
    $image = new Binary($data['image']);
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

$centers_collection->insertOne($center);

send_response("Center added", 201);
