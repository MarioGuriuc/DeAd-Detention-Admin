<?php
// Author: Vlad Spiridon

declare(strict_types=1);

use MongoDB\BSON\ObjectId;

require_once "utils.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_response('Method not allowed', 405);
}

$jwt = get_decoded_jwt();

if (!$jwt) {
    send_response('Unauthorized', 401);
}

$database = get_db_conn();
$inmates_collection = $database->selectCollection('inmates');

$url = $_SERVER['REQUEST_URI'];


$center_id = $params[0] ?? null;

$cursor = $inmates_collection->find([
    'center' => new ObjectId($center_id)
]);

$inmates = [];

foreach ($cursor as $inmate) {
    $filtered_inmate = [
        'id' => (string)$inmate['_id'],
        'image' => $inmate['image']->getData(),
        'name' => $inmate['fullName'],
        'crime' => $inmate['crime'],
        'sentence' => $inmate['sentence']
    ];
    $inmates[] = $filtered_inmate;
}

send_response_with_inmates($inmates);

