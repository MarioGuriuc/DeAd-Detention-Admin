<?php

use MongoDB\BSON\ObjectId;

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

$inmate_id = extract_inmate_id_from_url();

$database = get_db_conn();
$inmates_collection = $database->selectCollection('inmates');

$delete_result = $inmates_collection->deleteOne([
    '_id' => new ObjectId($inmate_id),
]);

if ($delete_result->getDeletedCount() === 0) {
    send_response("Inmate not found or not deleted", 404);
}

send_response("Inmate deleted", 200);

