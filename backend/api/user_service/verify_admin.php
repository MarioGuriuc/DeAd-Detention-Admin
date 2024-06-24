<?php

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    send_response("Method not allowed", 405);
}

$jwt = validate_and_return_jwt();

if (is_null($jwt) || $jwt->role !== "admin") {
    send_response("Unauthorized", 401);
}

send_response("Authorized", 200);
