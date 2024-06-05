<?php

//Author: Mario Guriuc

declare(strict_types=1);

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function get_authorization_header(): ?string
{
    $headers = null;
    $requestHeaders = apache_request_headers();
    if (isset($requestHeaders['Authorization'])) {
        $headers = trim($requestHeaders['Authorization']);
    }
    return $headers;
}

function get_bearer_token(): ?string
{
    $token = null;
    $headers = get_authorization_header();

    if (!empty($headers) && preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
        $token = $matches[1];
    }

    return $token;
}

function get_decoded_jwt(): ?stdClass
{
    $jwt = get_bearer_token();
    $key = $_ENV["JWT_KEY"];

    try {
        $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
    } catch (TypeError|Exception) {
        $decoded = null;
    }

    return $decoded;
}
