<?php

declare(strict_types=1);

use JetBrains\PhpStorm\NoReturn;

#[NoReturn] function send_response_with_inmates($inmates): void
{
    http_response_code(200);
    echo json_encode($inmates);
    exit();
}

function validate_inmate_data($data, $checks): array
{
    $errors = [];
    foreach ($checks as $field => $limits) {
        if (isset($data[$field])) {
            $length = strlen($data[$field]);
            if ($length < $limits['min'] || $length > $limits['max']) {
                $errors[] = "$field must be between {$limits['min']} and {$limits['max']} characters";
            }
        }
    }
    return $errors;
}

function extract_center_id_from_url(): ?string
{
    $url = $_SERVER['REQUEST_URI'];

    $urlParts = explode('/', $url);

    return $urlParts[3] ?? null;
}

#[NoReturn] function send_inmates_count(int $count): void
{
    $json = json_encode(['count' => $count]);
    http_response_code(200);
    echo $json;
    die();
}