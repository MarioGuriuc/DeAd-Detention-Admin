<?php

//Author: Mario Guriuc

declare(strict_types=1);

require_once "utils.php";
require_once "constants.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    send_response("Method not allowed", 405);
}

$jwt = validate_and_return_jwt();

if ($jwt) {
    send_response("Already logged in", 400);
}

$data = receive_json();

$empty = is_data_empty($data, LOGIN_REQUIRED_FIELDS);

if ($empty) {
    send_response($empty, 400);
}

$username = $data["username"];
$password = $data["password"];

$database = get_db_conn();

$users_collection = $database->selectCollection('users');
$user = $users_collection->findOne(["username" => $username]);

if (!$user) {
    send_response("User not found", 404);
}

if (!password_verify($password, $user["password"])) {
    send_response("Invalid password", 400);
}

$time = $_SERVER['REQUEST_TIME'];
$exp = $time + 3600 * 2; // 2 hours

if (isset($data["rememberMe"]) && $data["rememberMe"] === true) {
    $exp = $time + 3600 * 24 * 7; // 1 week
}

$token_payload = [
    "iss" => $_ENV["BACKEND_URL"],
    "sub" => $user["username"],
    "iat" => time(),
    "exp" => $exp,
    "role" => $user["role"]
];

$jwt = generate_jwt($token_payload);

send_response_with_jwt("Login successful", $jwt);
