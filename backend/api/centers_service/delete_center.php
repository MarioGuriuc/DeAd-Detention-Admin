<?php

use MongoDB\BSON\ObjectId;

require_once "utils.php";
require_once "constants.php";

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    send_response("Method not allowed", 405);
}

$jwt = validate_and_return_jwt();

if (is_null($jwt)) {
    send_response('Unauthorized', 401);
}

if ($jwt->role !== 'admin') {
    send_response("Unauthorized", 403);
}

$center_id = extract_center_id_from_url();

$database = get_db_conn();
$centers_collection = $database->selectCollection('centers');
$inmates_collection = $database->selectCollection('inmates');

$delete_result = $centers_collection->deleteOne([
    '_id' => new ObjectId($center_id),
]);
$inmates_deleted_result = $inmates_collection->deleteMany([
    'center' => new ObjectId($center_id),
]);

if ($delete_result->getDeletedCount() === 0) {
    send_response("Center not found or not deleted", 404);
}

send_response("Center deleted", 200);

