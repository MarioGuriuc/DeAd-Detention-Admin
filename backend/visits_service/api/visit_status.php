<?php
// Author: Vlad

use MongoDB\BSON\ObjectId;

if ($_SERVER["REQUEST_METHOD"] !== "PATCH") {
    send_response("Method not allowed", 405);
}

$jwt = validate_and_return_jwt();

if (is_null($jwt)) {
    send_response('Unauthorized', 401);
}

if ($jwt->role !== 'admin') {
    send_response('Unauthorized', 403);
}

$visit_id = extract_visit_id_from_url();

$data = receive_json();

if (empty($data["status"])) {
    send_response("Status is required", 400);
}

if (!in_array($data["status"], VISIT_STATUSES)) {
    send_response("Invalid status", 400);
}

$database = get_db_conn();
$visits_collection = $database->selectCollection('visits');

$visit = $visits_collection->findOne(["_id" => new ObjectId($visit_id)]);

if (!$visit) {
    send_response("Visit not found", 404);
}

$updateResult = $visits_collection->updateOne(
    ["_id" => new ObjectId($visit_id)],
    ['$set' => ["status" => $data["status"]]]
);

if ($updateResult->getModifiedCount() !== 1) {
    send_response("An error occurred while updating the visit status", 500);
}

send_response("Visit status updated successfully", 200);
