<?php

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    send_response("Method not allowed", 405);
}

$jwt = validate_and_return_jwt();

if (is_null($jwt)) {
    send_response("Unauthorized", 401);
}

$refreshed_jwt = refresh_and_return_jwt($jwt);

if (is_null($refreshed_jwt)) {
    send_response("Unauthorized", 401);
}

setcookie('JWT', $refreshed_jwt, [
    'domain' => $_ENV["COOKIE_DOMAIN"],
    'expires' => $jwt->exp + 60 * 15, // 15 minutes
    'path' => '/',
    'httpOnly' => true,
    'SameSite' => 'None',
    'Secure' => true
]);

send_response("Authorized", 200);
