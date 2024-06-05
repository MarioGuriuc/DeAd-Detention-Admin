<?php

//Author: Mario Guriuc

declare(strict_types=1);

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    send_response("Method not allowed", 405);
}

$jwt = get_decoded_jwt();

if (!$jwt) {
    send_response("Unauthorized", 401);
}

$username = $jwt->sub;
$username_param = $params[0] ?? '';

if ($username_param !== $username) {
    send_response("Unauthorized", 401);
}

$database = get_db_conn();
$users_collection = $database->selectCollection('users');

$user = $users_collection->findOne(["username" => $username]);

if (!$user) {
    send_response("User not found", 404);
}

$filteredUser = [
    'username' => $user['username'],
    'email' => $user['email'],
    'firstName' => $user['firstName'],
    'lastName' => $user['lastName'],
    'dob' => $user['dob'],
    'role' => $user['role'],
    'phone' => $user['phone']
];

echo json_encode($filteredUser);
