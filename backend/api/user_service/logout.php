<?php

// Author: Mario Guriuc

declare(strict_types=1);

require_once "utils.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    send_response("Method not allowed", 405);
}

setcookie('JWT', '', [
    'expires' => time() - 3600,
    'path' => '/',
    'httpOnly' => true,
    'SameSite' => 'None',
]);
send_response("Logged out successfully", 200);
