<?php

// Author: Mario Guriuc

declare(strict_types=1);

require_once "utils.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_response('Method not allowed', 405);
}

$data = receive_json();

$empty_field = is_data_empty($data, [
    'email' => 'Email field is empty'
]);

if ($empty_field) {
    send_response($empty_field, 400);
}

$database = get_db_conn();
$users_collection = $database->selectCollection('users');
$email = $users_collection->findOne(['email' => $data['email']]);

if (!$email) {
    send_response('Email not found', 404);
}

try {
    $password = generate_random_password();
    $subject = 'Your Detention Administration website new password';
    $body = get_email_body($password);
    send_email($subject, $body, $data['email']);
    change_user_password($data['email'], $password, $users_collection);
    send_response('Password sent, check your e-mail', 200);
} catch (Exception) {
    send_response('Password could not be sent, try again later', 500);
}
