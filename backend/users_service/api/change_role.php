<?php

if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    send_response("Method not allowed", 405);
}

$jwt = validate_and_return_jwt();

if ($jwt->role !== 'admin') {
    send_response("Unauthorized", 403);
}

$username = $params['username'] ?? '';

if ($username !== $jwt->sub) {
    send_response("Unauthorized", 403);
}

$data = receive_json();

if ($username === $data['username']) {
    send_response("You can't change your own role", 400);
}

$database = get_db_conn();

$users_collection = $database->selectCollection('users');
$user = $users_collection->findOne(["username" => $data['username']]);

if (!$user) {
    send_response("User not found", 404);
}

$updated = $users_collection->updateOne(["username" => $data['username']], ['$set' => ["role" => $data['role']]]);

if ($updated->getModifiedCount() === 0) {
    send_response("User already has this role", 500);
}

send_response("Role updated", 200);
