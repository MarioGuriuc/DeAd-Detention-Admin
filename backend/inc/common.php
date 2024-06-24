<?php

use PHPMailer\PHPMailer\PHPMailer;

function is_data_empty(array $data, array $fields): string
{
    $result = "";
    foreach ($fields as $field => $message) {
        if (empty($data[$field])) {
            $result = $message;
            break;
        }
    }
    return $result;
}

function sanitize_data(array|string &$data): void
{
    if (is_array($data)) {
        foreach ($data as $key => $value) {
            $data[$key] = htmlspecialchars($value);
        }
    }
    else {
        $data = htmlspecialchars($data);
    }
}

function send_response(string $result, int $status_code): void
{
    $json = json_encode(["result" => $result]);
    http_response_code($status_code);
    echo $json;
    die();
}

function receive_json(): array
{
    $data = json_decode(file_get_contents("php://input"), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        send_response("Invalid JSON", 400);
    }
    return $data;
}

/**
 * @throws Exception
 */
function send_email(string $subject, string $body, string $email): void
{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $_ENV['SMTP_HOST'];
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['EMAIL'];
    $mail->Password = $_ENV['EMAIL_PASSWORD'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = $_ENV['SMTP_PORT'];

    $mail->setFrom('de-ad@gmail.com', 'DeAd');
    $mail->addAddress($email);

    $mail->isHTML();
    $mail->Subject = $subject;
    $mail->Body = $body;

    $mail->send();
}
