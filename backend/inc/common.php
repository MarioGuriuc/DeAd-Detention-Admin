<?php

// Author: Mario Guriuc

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

function sanitize_data(array &$data): void
{
    foreach ($data as $key => $value) {
        $data[$key] = htmlspecialchars(strip_tags($value));
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
