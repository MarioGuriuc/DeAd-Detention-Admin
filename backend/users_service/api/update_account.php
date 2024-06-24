<?php

// Author: Mario Guriuc

if ($_SERVER["REQUEST_METHOD"] !== "PATCH") {
    send_response("Method not allowed", 405);
}

$jwt = validate_and_return_jwt();

if (is_null($jwt)) {
    send_response("Unauthorized", 401);
}

$username = $jwt->sub;
$username_param = $params['username'] ?? '';

if ($username_param !== $username) {
    send_response("Unauthorized", 401);
}

$data = receive_json();

$database = get_db_conn();
$users_collection = $database->selectCollection('users');

if (empty($data["password"]) || empty($data["confirmPassword"])) {
    send_response("Please enter your password", 400);
}

if ($data["password"] !== $data["confirmPassword"]) {
    send_response("Passwords do not match", 400);
}

$user = $users_collection->findOne(["username" => $jwt->sub]);

if ($data["password"] && !password_verify($data["password"], $user["password"])) {
    send_response("Incorrect password", 400);
}

unset($data["password"], $data["confirmPassword"]);

foreach ($data as $key => $value) {
    if (empty($value)) {
        unset($data[$key]);
    }
}

validate_user_data($data, CHANGE_CHECKS);

sanitize_data($data);

echo json_encode($data, JSON_PRETTY_PRINT);

if (array_key_exists("email", $data)) {
    $email_exists = $users_collection->findOne(["email" => $data["email"]]);
    if ($email_exists) {
        send_response("Email already in use", 400);
    }
}

if (array_key_exists("username", $data)) {
    $username_exists = $users_collection->findOne(["username" => $data["username"]]);
    if ($username_exists) {
        send_response("Username already in use", 400);
    }
}

if (empty($data)) {
    send_response("No changes were made", 400);
}

$result = $users_collection->updateOne(["username" => $jwt->sub], ['$set' => $data]);

if ($result->getModifiedCount() !== 1) {
    send_response("No changes were made", 400);
}

send_response("Account updated successfully, please login again", 200);
