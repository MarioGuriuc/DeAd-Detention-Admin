<?php

function validate_register_data(array $data, array $checks): void
{
    foreach ($data as $key => $value) {
        if (array_key_exists($key, $checks)) {
            validate_string($value, $checks[$key]);
        }
    }

    if (!DateTime::createFromFormat('Y-m-d', $data["dob"])) {
        send_response("Please enter a valid date of birth", 400);
    }
}

function validate_user_data(array $data, array $checks): void
{
    foreach ($data as $key => $value) {
        if (array_key_exists($key, $checks)) {
            validate_string($value, $checks[$key]);
        }
    }
}

function validate_string(string $data, array $checks): void
{
    $len = strlen($data) ?? 0;
    if (array_key_exists("min", $checks) && $len < $checks["min"]) {
        send_response($checks["message"], 400);
    }
    if (array_key_exists("max", $checks) && $len > $checks["max"]) {
        send_response($checks["message"], 400);
    }
    if (array_key_exists("regex", $checks) && !preg_match($checks["regex"], $data)) {
        send_response($checks["message"], 400);
    }
}

function send_response_with_jwt($message, string $jwt): void
{
    $json = json_encode(["result" => $message, "jwt" => $jwt]);
    http_response_code(200);
    echo $json;
}

function send_response_with_user(array $user): void
{
    $json = json_encode($user);
    http_response_code(200);
    echo $json;
}

function change_user_password($email, $password, $users_collection): void
{
    $hash_password = password_hash($password, PASSWORD_DEFAULT);
    $users_collection->updateOne(['email' => $email], ['$set' => ['password' => $hash_password]]);
}

function get_email_body($password): string
{
    return "Hello there,<br><br>
            A password change has been requested for your acount.<br><br>
            Your new password is: " . $password . "<br><br>
            Please change it as soon as possible.<br><br>
            Best regards,<br>
            DeAd team";
}

function generate_random_password($length = 10): string
{
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $password = '';
    for ($i = 0; $i < $length; $i++) {
        $password .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $password;
}
