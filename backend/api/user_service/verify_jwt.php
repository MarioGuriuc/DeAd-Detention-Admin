<?php

require_once "utils.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    send_response("Method not allowed", 405);
}

$jwt = validate_and_return_jwt();

if (is_null($jwt)) {
    send_response("Unauthorized", 401);
}

$refreshed_jwt = refresh_and_return_jwt($jwt);

send_response_with_jwt(null, $refreshed_jwt);
