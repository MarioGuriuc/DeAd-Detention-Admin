<?php
// Author: Vlad Spiridon

declare(strict_types=1);

use MongoDB\BSON\ObjectId;

require_once "utils.php";

if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    send_response('Method not allowed', 405);
}

$jwt = validate_and_return_jwt();

if (is_null($jwt)) {
    send_response('Unauthorized', 401);
}
$url = $_SERVER['REQUEST_URI'];

$database = get_db_conn();
$inmates_collection = $database->selectCollection('inmates');

$inmateId = extract_inmate_id_from_url();
$newCenterId = extract_center_id_from_url();

try {

    $inmateId = new ObjectId($inmateId);
    $newCenterId = new ObjectId($newCenterId);

    $result = $inmates_collection->updateOne(
        ['_id' => $inmateId],
        ['$set' => ['center' => $newCenterId]]
    );

    if ($result->getModifiedCount() > 0) {
        send_response('Inmate transferred successfully', 200);
    } else {
        send_response('Inmate not found', 404);
    }
} catch (Throwable $e) {
    send_response('Internal server error', 500);
}
