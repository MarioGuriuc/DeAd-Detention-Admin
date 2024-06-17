<?php

use MongoDB\BSON\Binary;
use MongoDB\BSON\ObjectId;

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


$empty_fields = is_data_empty($data, INMATE_REQUIRED_FIELDS);

if ($empty_fields) {
    send_response($empty_fields, 400);
}

validate_inmate_data($data, INMATE_CHECKS);

$image = null;
if (!empty($data['image'])) {
    $image = new Binary($data['image']);
}

$center_id = extract_center_id_from_url();
$inmate = [
    'image' => new Binary($data['image']),
    'fullName' => $data['name'],
    'crime' => $data['crime'],
    'sentence' => $data['sentence'],
    'center' => new ObjectId($center_id)
];

$database = get_db_conn();
$inmates_collection = $database->selectCollection('inmates');

$inmates_collection->insertOne($inmate);

send_response("Inmate added", 201);
