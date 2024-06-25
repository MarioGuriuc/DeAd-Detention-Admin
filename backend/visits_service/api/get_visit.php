<?php

// Author: Vlad Spiridon

declare(strict_types=1);

use MongoDB\BSON\ObjectId;

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_response('Method not allowed', 405);
}

$database = get_db_conn();
$visits_collection = $database->selectCollection('visits');
$centers_collection = $database->selectCollection('centers');
$inmates_collection = $database->selectCollection('inmates');

$visit_id = extract_visit_id_from_url();

$url = $_SERVER['REQUEST_URI'];

$visit = $visits_collection->findOne(['_id' => new ObjectId($visit_id)]);

$current_date = new DateTime();

$center_id = (string)$visit['center'];
$inmate_id = (string)$visit['inmate'];

$center = $centers_collection->findOne(['_id' => new ObjectId($center_id)]);
$inmate = $inmates_collection->findOne(['_id' => new ObjectId($inmate_id)]);

try {
    $visit_date = new DateTime($visit['date']);
    if ($visit_date < $current_date) {
        $visit['status'] = 'expired';
    }

} catch (Exception $e) {
    send_response('An error occurred while processing the visit date', 500);
}

$new_visit = [
    'id' => (string)$visit['_id'],
    'date' => $visit['date'],
    'time' => $visit['time'],
    'duration' => $visit['duration'],
    'nature' => $visit['nature'],
    'objectsExchanged' => $visit['objectsExchanged'],
    'summary' => $visit['summary'],
    'health' => $visit['health'],
    'witnesses' => $visit['witnesses'],
    'creator' => $visit['creator'],
    'center' => [
        'name' => $center['title']
    ],
    'inmate' => [
        'fullName' => $inmate['fullName']
    ],
    'status' => $visit['status']
];


send_response_with_visits($new_visit);
