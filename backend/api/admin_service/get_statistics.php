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

$uri = $_SERVER['REQUEST_URI'];
$segments = explode('/', parse_url($uri, PHP_URL_PATH));
$params = array_slice($segments, array_search('statistics', $segments) + 1);

if (count($params) !== 4) {
    send_response('Invalid parameters', 400);
}

[$center_id, $inmate_id, $start_date, $end_date] = $params;

try {
    $startDateTime = new DateTime($start_date);
    $endDateTime = new DateTime($end_date);
    if ($startDateTime > $endDateTime) {
        send_response('Start date cannot be after end date', 400);
    }
} catch (Exception $e) {
    send_response('Invalid date format', 400);
}


$database = get_db_conn();
$visits_collection = $database->selectCollection('visits');
$centers_collection = $database->selectCollection('centers');
$inmates_collection = $database->selectCollection('inmates');

$filter = [
    'date' => [
        '$gte' => $start_date,
        '$lte' => $end_date
    ]
];

if ($center_id !== 'all') {
    $filter['center'] = new ObjectId($center_id);
}

if ($inmate_id !== 'all') {
    $filter['inmate'] = new ObjectId($inmate_id);
}

$cursor = $visits_collection->find($filter);

$visits = [];
$visitCount = 0;
$totalDuration = 0;
$totalWitnesses = 0;
$creators = [];

foreach ($cursor as $visit) {
    $visitCount++;
    $totalDuration += $visit['duration'];
    $totalWitnesses += $visit['witnesses'];
    $creators[] = $visit['creator'];

    $center_id = (string)$visit['center'];
    $inmate_id = (string)$visit['inmate'];

    $center = $centers_collection->findOne(['_id' => new ObjectId($center_id)]);
    $inmate = $inmates_collection->findOne(['_id' => new ObjectId($inmate_id)]);

    $filtered_visit = [
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
        ]
    ];
    $visits[] = $filtered_visit;
}

$uniqueCreators = array_unique($creators);
$uniqueCreatorsValues = array_values($uniqueCreators);

$averageDuration = $visitCount > 0 ? $totalDuration / $visitCount : 0;

$statistics = [
    'visitCount' => $visitCount,
    'totalDuration' => $totalDuration,
    'averageDuration' => $averageDuration,
    'totalWitnesses' => $totalWitnesses,
    'uniqueCreatorsCount' => count($uniqueCreators),
    'creators' => $uniqueCreatorsValues,
];

send_response_with_stats($statistics, 200);
