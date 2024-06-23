<?php

use MongoDB\BSON\Binary;
use MongoDB\BSON\ObjectId;

require_once "utils.php";
require_once "constants.php";

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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

$empty_fields = is_data_empty($data, INMATE_REQUIRED_FIELDS);

if ($empty_fields) {
    send_response($empty_fields, 400);
}

validate_inmate_data($data, INMATE_CHECKS);

if (!is_array($data['crimes']) || empty($data['crimes'])) {
    send_response("Crimes must be a non-empty array", 400);
}

if (!is_array($data['sentences']) || empty($data['sentences'])) {
    send_response("Sentences must be a non-empty array", 400);
}

foreach ($data['crimes'] as $crime) {
    if (!is_string($crime) || empty($crime)) {
        send_response("Each crime must be a non-empty string", 400);
    }
}

foreach ($data['sentences'] as $sentence) {
    if (!is_string($sentence) || empty($sentence)) {
        send_response("Each sentence must be a non-empty string", 400);
    }
}

$image = null;
if (!empty($data['image'])) {
    $image = new Binary($data['image']);
}

$center_id = extract_center_id_from_url();

$inmate = [
    'image' => $image,
    'fullName' => $data['name'],
    'crimes' => $data['crimes'],
    'sentences' => $data['sentences'],
    'center' => new ObjectId($center_id)
];

$database = get_db_conn();
$inmates_collection = $database->selectCollection('inmates');

$result = $inmates_collection->insertOne($inmate);

if (!$result->getInsertedCount()) {
    send_response("Inmate not added", 500);
}
send_response("Inmate added", 201);
