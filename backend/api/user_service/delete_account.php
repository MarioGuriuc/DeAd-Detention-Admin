<?php

//Author: Mario Guriuc

declare(strict_types=1);

if ($_SERVER["REQUEST_METHOD"] !== "DELETE") {
    send_response("Method not allowed", 405);
}

$jwt = get_decoded_jwt();

if (!$jwt) {
    send_response("Unauthorized", 401);
}

$username_param = $params[0] ?? '';
$username = $jwt->sub;

if ($username_param !== $username) {
    send_response("Unauthorized", 401);
}

$data = receive_json();

$password = $data["password"] ?? "";

if (empty($password)) {
    send_response("Password is required", 400);
}

sanitize_data($password);

$database = get_db_conn();
$users_collection = $database->selectCollection('users');
$user = $users_collection->findOne(["username" => $username]);

if (!$user || !password_verify($password, $user["password"])) {
    send_response("Invalid password", 400);
}

$users_collection->deleteOne(["username" => $username]);

send_response("Account deleted", 200);
