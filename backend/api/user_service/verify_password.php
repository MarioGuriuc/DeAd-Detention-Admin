<?php

require_once 'utils.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    send_response("Method not allowed", 405);
}

$jwt = get_decoded_jwt();

if (!$jwt) {
    send_response("Unauthorized", 401);
}

$username = $jwt->sub;

$data = receive_json();

if (!isset($data["password"])) {
    send_response("Password is required", 400);
}

$password = $data["password"];

$database = get_db_conn();

$users_collection = $database->selectCollection('users');

$user = $users_collection->findOne(["username" => $username]);

if (!$user || !password_verify($password, $user["password"])) {
    send_response("Invalid password", 400);
}

send_response("Password verified", 200);
