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
$visits_collection = $database->selectCollection('visits');
$centers_collection = $database->selectCollection('centers');
$inmates_collection = $database->selectCollection('inmates');

$username = extract_username_from_url();

$url = $_SERVER['REQUEST_URI'];

$cursor = $visits_collection->find(['created_by' => $username]);

$visits = [];

$current_date = new DateTime();

foreach ($cursor as $visit) {
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


    $filtered_visit = [
        'id' => (string)$visit['_id'],
        'date' => $visit['date'],
        'time' => $visit['time'],
        'duration' => $visit['duration'],
        'nature' => $visit['nature'],
        'objects_exchanged' => $visit['objects_exchanged'],
        'summary' => $visit['summary'],
        'health' => $visit['health'],
        'witnesses' => $visit['witnesses'],
        'created_by' => $visit['created_by'],
        'center' => [
            'name' => $center['title']
        ],
        'inmate' => [
            'fullName' => $inmate['fullName']
        ],
        'status' => $visit['status']
    ];
    $visits[] = $filtered_visit;
}

send_response_with_visits($visits);
