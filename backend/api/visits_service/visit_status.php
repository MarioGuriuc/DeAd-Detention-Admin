<?php
// Author: Vlad

require_once 'utils.php';
require_once 'constants.php';

if ($_SERVER["REQUEST_METHOD"] !== "PATCH") {
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

if (empty($data["status"])) {
    send_response("Status is required", 400);
}

$allowed_statuses = ["pending", "approved", "denied","attended"];
if (!in_array($data["status"], $allowed_statuses)) {
    send_response("Invalid status", 400);
}

$database = get_db_conn();
$visits_collection = $database->selectCollection('visits');

$visit = $visits_collection->findOne(["_id" => new MongoDB\BSON\ObjectId($visit_id)]);

if (!$visit) {
    send_response("Visit not found", 404);
}

$updateResult = $visits_collection->updateOne(
    ["_id" => new MongoDB\BSON\ObjectId($visit_id)],
    ['$set' => ["status" => $data["status"]]]
);

if ($updateResult->getModifiedCount() !== 1) {
    send_response("An error occurred while updating the visit status", 500);
}

send_response("Visit status updated successfully", 200);
