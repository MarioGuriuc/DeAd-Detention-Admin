<?php

// Author: Vlad Spiridon

declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_response('Method not allowed', 405);
}

$jwt = validate_and_return_jwt();

if (is_null($jwt)) {
    send_response('Unauthorized', 401);
}

$database = get_db_conn();
$users_collection = $database->selectCollection('users');
$cursor = $users_collection->find();

$url = $_SERVER['REQUEST_URI'];

$users = [];

foreach ($cursor as $document) {
    $users[] = [
        'id' => (string) $document['_id'],
        'firstName' => $document['firstName'],
        'lastName' => $document['lastName'],
        'username' => $document['username'],
        'email' => $document['email'],
        'phone' => $document['phone'],
        'dob' => $document['dob'],
        'role' => $document['role']
    ];
}

send_response_with_users($users);
