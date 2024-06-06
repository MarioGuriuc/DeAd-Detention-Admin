<?php

// Author: Mario Guriuc

declare(strict_types=1);

require_once 'utils.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_response("Method not allowed", 405);
}

$jwt = get_decoded_jwt();

if (!$jwt) {
    send_response("Unauthorized", 401);
}

$data = receive_json();

$username = $jwt->sub;
$route_params = $GLOBALS['params'] ?? [];

if (count($route_params) !== 1 || $route_params[0] !== $username) {
    send_response("Unauthorized", 401);
}

$database = get_db_conn();
$users_collection = $database->selectCollection('users');

if (empty($data['newPassword'])) {
    send_response("New password is required", 400);
}

$result = $users_collection->updateOne(
    ["username" => $username],
    ['$set' => ["password" => password_hash($data['newPassword'], PASSWORD_DEFAULT)]]
);

if ($result->getModifiedCount() !== 1) {
    send_response("An error occurred while changing the password", 500);
}

send_response("Password changed", 200);
