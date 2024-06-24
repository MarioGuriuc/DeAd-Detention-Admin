<?php

use MongoDB\BSON\Binary;
use MongoDB\BSON\ObjectId;

require_once "utils.php";
require_once "constants.php";

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

$inmate_id = extract_inmate_id_from_url();

$inmateUpdates = [];

if (isset($data['name'])) {
    $inmateUpdates['fullName'] = trim($data['name']);
}

if (isset($data['crimes'])) {
    if (!is_array($data['crimes']) || empty($data['crimes'])) {
        send_response("Crimes must be a non-empty array", 400);
    }
    $inmateUpdates['crimes'] = $data['crimes'];
}

if (isset($data['sentences'])) {
    if (!is_array($data['sentences']) || empty($data['sentences'])) {
        send_response("Sentences must be a non-empty array", 400);
    }
    $inmateUpdates['sentences'] = $data['sentences'];
}

if (isset($data['image'])) {
    $inmateUpdates['image'] = new Binary($data['image']);
}
$database = get_db_conn();
$inmates_collection = $database->selectCollection('inmates');

$updateResult = $inmates_collection->updateOne(
    ['_id' => new ObjectId($inmate_id)],
    ['$set' => $inmateUpdates]
);

send_response("Inmate updated successfully.", 200);


