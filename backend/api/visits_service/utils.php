<?php

function extract_inmate_id_from_url(): ?string
{
    $url = $_SERVER['REQUEST_URI'];
    $regex = '/inmates\/([a-f0-9]{24})\/add-visit/';
    if (preg_match($regex, $url, $matches)) {
        return $matches[1];
    } else {
        send_response("Inmate ID not found in the URL", 400);
    }
    return null;
}


function extract_center_id_from_url(): ?string
{
    $url = $_SERVER['REQUEST_URI'];

    $urlParts = explode('/', $url);

    return $urlParts[3] ?? null;
}

function send_response_with_visits(array $visits): void
{
    header('Content-Type: application/json');
    http_response_code(200);
    echo json_encode(['visits' => $visits]);
    exit;
}

function extract_username_from_url(): ?string
{
    $url = $_SERVER['REQUEST_URI'];
    $regex = '/account\/([a-zA-Z0-9_]+)\/visits/';
    if (preg_match($regex, $url, $matches)) {
        return $matches[1];
    } else {
        send_response("Username not found in the URL", 400);
    }
    return null;
}
