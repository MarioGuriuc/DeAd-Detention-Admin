<?php

// Author: Mario Guriuc

declare(strict_types=1);

function send_response_with_centers($centers): void
{
    $json = json_encode($centers);
    http_response_code(200);
    echo $json;
    die();
}

function send_centers_count(int $count): void
{
    $json = json_encode(['count' => $count]);
    http_response_code(200);
    echo $json;
    die();
}

function validate_center_data(array $data, array $checks): void
{
    if (array_key_exists("image", $data) && $data["image"]->type !== 0) {
        send_response("Invalid image", 400);
    }

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
