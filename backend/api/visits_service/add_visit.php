<?php

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

$data = receive_json();

$empty_fields = is_data_empty($data, VISIT_REQUIRED_FIELDS);

if ($empty_fields) {
   send_response("Missing fields", 400);
}

$center_id = extract_center_id_from_url();
$inmate_id = extract_inmate_id_from_url();

$visit = [
    'center' => new ObjectId($center_id),
    'inmate' => new ObjectId($inmate_id),
    'created_by' => $data['user'],
    'date' => $data['date'],
    'time' => $data['time'],
    'duration' => $data['duration'],
    'nature' => $data['nature'],
    'objects_exchanged' => $data['objects_exchanged'],
    'summary' => $data['summary'],
    'health' => $data['health'],
    'witnesses' => $data['witnesses'],
    'status' => 'pending'
];

$database = get_db_conn();
$visits_collection = $database->selectCollection('visits');

$visits_collection->insertOne($visit);

send_response("Visit added", 201);
