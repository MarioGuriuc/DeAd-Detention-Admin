<?php

use MongoDB\BSON\ObjectId;

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    send_response("Method not allowed", 405);
}

$jwt = validate_and_return_jwt();

if (is_null($jwt)) {
    send_response('Unauthorized', 401);
}

$data = receive_json();

$empty_fields = is_data_empty($data, VISIT_REQUIRED_FIELDS);

if ($empty_fields) {
    send_response($empty_fields, 400);
}

$center_id = extract_center_id_from_url();
$inmate_id = extract_inmate_id_from_url();

$database = get_db_conn();
$centers_collection = $database->selectCollection('centers');
$inmates_collection = $database->selectCollection('inmates');
$visits_collection = $database->selectCollection('visits');

$center = $centers_collection->findOne(["_id" => new ObjectId($center_id)]);
if (!$center) {
    send_response("Center not found", 404);
}

$inmate = $inmates_collection->findOne(["_id" => new ObjectId($inmate_id), "center" => new ObjectId($center_id)]);
if (!$inmate) {
    send_response("Inmate not found in the specified center", 404);
}

if ($data['witnesses'] <= 0) {
    send_response("The number of witnesses must be a positive number.", 400);
}

if (!in_array($data['nature'], VISIT_ALLOWED_NATURES)) {
    send_response("Invalid nature of visit.", 400);
}

$current_date = new DateTime();
$visit_date = new DateTime($data['date']);
if ($visit_date <= $current_date) {
    send_response("The date of the visit must be in the future.", 400);
}


$visit_start_time = new DateTime($data['date'] . ' ' . $data['time']);
$visit_end_time = clone $visit_start_time;
$visit_end_time->modify('+' . $data['duration'] . ' minutes');

$existing_visits = $visits_collection->find([
    'inmate' => new ObjectId($inmate_id),
    'date' => $data['date']
]);

foreach ($existing_visits as $existing_visit) {
    $existing_start_time = new DateTime($data['date'] . ' ' . $existing_visit['time']);
    $existing_end_time = clone $existing_start_time;
    $existing_end_time->modify('+' . $existing_visit['duration'] . ' minutes');

    if ($visit_start_time < $existing_end_time && $visit_end_time > $existing_start_time) {
        send_response("There is already a visit scheduled during this time.", 400);
    }
}

$visit = [
    'center' => new ObjectId($center_id),
    'inmate' => new ObjectId($inmate_id),
    'creator' => $data['user'],
    'date' => $data['date'],
    'time' => $data['time'],
    'duration' => $data['duration'],
    'nature' => $data['nature'],
    'objectsExchanged' => $data['objectsExchanged'],
    'summary' => $data['summary'],
    'health' => $data['health'],
    'witnesses' => $data['witnesses'],
    'status' => 'pending'
];

$result = $visits_collection->insertOne($visit);

if ($result->getInsertedCount() > 0) {
    send_response("Visit added", 201);
}
else {
    send_response("Error while adding the visit ", 201);
}

