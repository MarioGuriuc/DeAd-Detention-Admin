<?php

// Author: Vlad

use MongoDB\BSON\Binary;
use MongoDB\BSON\ObjectId;

if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    send_response("Method not allowed", 405);
}

$jwt = validate_and_return_jwt();

if (is_null($jwt)) {
    send_response('Unauthorized', 401);
}

if ($jwt->role !== 'admin') {
    send_response("Unauthorized", 403);
}

$data = receive_json();

$center_id = extract_center_id_from_url();

$centerUpdates = [];

if (isset($data['title'])) {
    $centerUpdates['title'] = trim($data['title']);
}

if (isset($data['location'])) {
    $centerUpdates['location'] = trim($data['location']);
}

if (isset($data['description'])) {
    $centerUpdates['description'] = trim($data['description']);
}

if (isset($data['image'])) {
    $centerUpdates['image'] = new Binary($data['image']);
}

$database = get_db_conn();
$centers_collection = $database->selectCollection('centers');

$updateResult = $centers_collection->updateOne(
    ['_id' => new ObjectId($center_id)],
    ['$set' => $centerUpdates]
);

if ($updateResult->getMatchedCount() === 0) {
    send_response("Center not found", 404);
}

if ($updateResult->getModifiedCount() === 0) {
    send_response("No changes made to the center", 200);
}

send_response("Center updated successfully.", 200);
