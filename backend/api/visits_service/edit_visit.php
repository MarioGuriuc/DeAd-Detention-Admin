<?php

// Author: Vlad

require_once 'utils.php';
require_once 'constants.php';

if ($_SERVER["REQUEST_METHOD"] !== "PUT") {
    send_response("Method not allowed", 405);
}

$jwt = get_decoded_jwt();

if (!$jwt) {
    send_response("Unauthorized", 401);
}

$route_params = $GLOBALS['params'] ?? [];

if (count($route_params) !== 1) {
    send_response("Unauthorized", 401);
}

$visit_id = $route_params[0];

$data = receive_json();

$required_fields = ["date", "time", "duration", "nature", "objects_exchanged", "summary", "health", "witnesses"];
foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        send_response("$field is required", 400);
    }
}

$allowed_natures = ["Official", "Personal", "Legal", "Medical"];
if (!in_array($data["nature"], $allowed_natures)) {
    send_response("Invalid nature", 400);
}

$database = get_db_conn();
$visits_collection = $database->selectCollection('visits');

$visit = $visits_collection->findOne(["_id" => new MongoDB\BSON\ObjectId($visit_id)]);

if (!$visit) {
    send_response("Visit not found", 404);
}

$updateData = [
    "date" => $data["date"],
    "time" => $data["time"],
    "duration" => $data["duration"],
    "nature" => $data["nature"],
    "objects_exchanged" => $data["objects_exchanged"],
    "summary" => $data["summary"],
    "health" => $data["health"],
    "witnesses" => $data["witnesses"],
    'status' => 'pending'
];

$updateResult = $visits_collection->updateOne(
    ["_id" => new MongoDB\BSON\ObjectId($visit_id)],
    ['$set' => $updateData]
);

if ($updateResult->getModifiedCount() !== 1) {
    send_response("An error occurred while updating the visit", 500);
}

send_response("Visit updated successfully", 200);

