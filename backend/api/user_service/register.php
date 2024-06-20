<?php

//Author: Mario Guriuc

declare(strict_types=1);

require_once "utils.php";
require_once "constants.php";

$jwt = get_decoded_jwt();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    send_response("Method not allowed", 405);
}

$jwt = validate_and_return_jwt();

$data = receive_json();

$empty_field = is_data_empty($data, USER_REQUIRED_FIELDS);

if ($empty_field) {
    send_response($empty_field, 400);
}

validate_register_data($data, REGISTER_CHECKS);

sanitize_data($data);

$database = get_db_conn();
$users_collection = $database->selectCollection('users');

$existing_user = $users_collection->findOne(['$or' => [["username" => $data["username"]], ["email" => $data["email"]]]]);

if ($existing_user) {
    send_response("Username or email already in use", 400);
}

if ($data["password"] !== $data["confirmPassword"]) {
    send_response("Passwords do not match", 400);
}

$hashed_password = password_hash($data["password"], PASSWORD_DEFAULT);

$new_user = [
    "firstName" => $data["firstName"],
    "lastName" => $data["lastName"],
    "username" => $data["username"],
    "email" => $data["email"],
    "password" => $hashed_password,
    "phone" => $data["phone"],
    "dob" => $data["dob"],
    "role" => "user"
];

$insert_result = $users_collection->insertOne($new_user);

if ($insert_result->getInsertedCount() !== 1) {
    send_response("Registration failed", 500);
}

send_response("Registration successful", 201);
