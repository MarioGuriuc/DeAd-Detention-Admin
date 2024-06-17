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

$page_number = $params[0] ?? 1;

if (!is_numeric($page_number) || $page_number < 1) {
    $page_number = 1;
}

$limit = 12;
$skip = ($page_number - 1) * $limit;

$center_id = extract_center_id_from_url();
$centerObjectId = new ObjectId($center_id);

$cursor = $inmates_collection->find([
    'center' => $centerObjectId
], [
    'skip' => $skip,
    'limit' => $limit
]);

$inmates = [];

$center_id = extract_center_id_from_url();

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

