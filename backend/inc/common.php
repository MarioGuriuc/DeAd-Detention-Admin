<?php

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

function sanitize_data(array | string &$data): void
{
    if (is_array($data)) {
        foreach ($data as $key => $value) {
            $data[$key] = htmlspecialchars(strip_tags($value));
        }
    } else {
        $data = htmlspecialchars(strip_tags($data));
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
