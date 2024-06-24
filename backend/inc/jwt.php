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

function refresh_and_return_jwt(stdClass $jwt): string|null
{
    $users_collection = get_db_conn()->selectCollection('users');
    $user_role = $users_collection->findOne(["username" => $jwt->sub], ["projection" => ["role" => 1]]);

    if (is_null($user_role)) {
        return null;
    }

    $token_payload = [
        "iss" => $_ENV["BACKEND_URL"],
        "sub" => $jwt->sub,
        "iat" => time(),
        "exp" => $jwt->exp + 60 * 15, // 15 minutes
        "role" => $user_role["role"]
    ];

    return generate_jwt($token_payload);
}
