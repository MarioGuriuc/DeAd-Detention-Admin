<?php

declare(strict_types=1);

function send_response_with_inmates($inmates): void
{
    http_response_code(200);
    echo json_encode($inmates);
    exit();
}

function validate_inmate_data($data, $checks): void
{
    foreach ($data as $key => $value) {
        if (array_key_exists($key, $checks)) {
            validate_string($value, $checks[$key]);
        }
    }
}

function validate_string($data, $checks): void
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

function extract_center_id_from_url(): ?string
{
    $url = $_SERVER['REQUEST_URI'];

    $url_parts = explode('/', $url);

    return $url_parts[3] ?? null;
}

function send_inmates_count(int $count): void
{
    $json = json_encode(['count' => $count]);
    http_response_code(200);
    echo $json;
    die();
}

function extract_page_number_from_url($url): int|string
{
    $path = parse_url($url, PHP_URL_PATH);

    $pattern = '#/centers/[^/]+/inmates/([^/]+)#';

    if (preg_match($pattern, $path, $matches)) {
        return $matches[1];
    }

    return 'No page number found';
}

