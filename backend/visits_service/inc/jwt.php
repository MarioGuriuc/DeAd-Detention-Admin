<?php

//Author: Mario Guriuc

declare(strict_types=1);

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function get_jwt_from_cookie(): ?string
{
    if (isset($_COOKIE['JWT'])) {
        return $_COOKIE['JWT'];
    }
    return null;
}

function get_decoded_jwt(): ?stdClass
{
    $jwt = get_jwt_from_cookie();
    $key = $_ENV["JWT_KEY"];

    try {
        $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
    } catch (TypeError|Exception) {
        $decoded = null;
    }

    return $decoded;
}

function generate_jwt(array $token_payload): string
{
    $jwt_secret_key = $_ENV["JWT_KEY"];
    return JWT::encode($token_payload, $jwt_secret_key, 'HS256');
}

function validate_and_return_jwt(): ?stdClass
{
    $jwt = get_decoded_jwt();

    if (is_null($jwt)) {
        return null;
    }

    if ($jwt->exp < time() || $jwt->iat > time() || $jwt->iss !== $_ENV["BACKEND_URL"]) {
        return null;
    }

    return $jwt;
}
