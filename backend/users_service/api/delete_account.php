<?php

// Author: Mario Guriuc

declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
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

$database = get_db_conn();
$users_collection = $database->selectCollection('users');
$result = $users_collection->deleteOne(["username" => $username]);

if ($result->getDeletedCount() === 1) {
    send_response("Account deleted", 200);
}
else {
    send_response("An error occurred while deleting the account", 500);
}
