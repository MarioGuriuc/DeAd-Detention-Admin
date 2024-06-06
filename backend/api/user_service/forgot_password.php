<?php

// Author: Mario Guriuc

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

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

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = $_ENV['SMTP_HOST'];
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['EMAIL'];
    $mail->Password = $_ENV['EMAIL_PASSWORD'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = $_ENV['SMTP_PORT'];

    $mail->setFrom('de-ad@gmail.com', 'DeAd');
    $mail->addAddress($data['email']);

    $password = generate_random_password();
    change_user_password($data['email'], $password, $users_collection);

    $mail->isHTML();
    $mail->Subject = 'Your Detention Administration website new password';
    $mail->Body = get_email_body($password);

    $mail->send();
    send_response('Password sent, check your e-mail', 200);
} catch (Exception) {
    send_response('Password could not be sent, try again later', 500);
}
