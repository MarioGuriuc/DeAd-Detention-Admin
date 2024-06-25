<?php

// Author: Mario Guriuc

require_once "vendor/autoload.php";
require_once "inc/jwt.php";
require_once "inc/get_db_conn.php";
require_once "inc/common.php";
require_once "inc/utils.php";
require_once "inc/constants.php";

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$route = trim($_SERVER['REQUEST_URI'], '/');

$method = $_SERVER['REQUEST_METHOD'];

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$api_routes = [
    'GET' => [
        'api/get-username' => 'api/get_username.php',
        'api/logout' => 'api/logout.php',
        'api/account/{username}' => 'api/get_account_info.php',
        'api/verify-jwt' => 'api/verify_jwt.php',
        'api/verify-admin' => 'api/verify_admin.php',
        'api/statistics/{center_id}/{inmate_id}/{start_date}/{end_date}' => 'api/get_statistics.php',//Vlad
        'api/users' => 'api/get_users.php',//Vlad
    ],
    'POST' => [
        'api/login' => 'api/login.php',
        'api/register' => 'api/register.php',
        'api/forgot-password' => 'api/forgot_password.php',
    ],
    'PATCH' => [
        'api/account/{username}' => 'api/update_account.php',
        'api/{username}/change-password' => 'api/change_password.php',
        'api/{username}/change-role' => 'api/change_role.php',
    ],
    'DELETE' => [
        'api/account/{username}' => 'api/delete_account.php',
    ],
];

function match_route($route, $routes, &$params): bool|string
{
    foreach ($routes as $pattern => $file) {
        $paramNames = [];
        $pattern = preg_replace_callback('/\{([a-zA-Z0-9_]+)}/', function ($matches) use (&$paramNames) {
            $paramNames[] = $matches[1];
            return '([^/]+)';
        }, $pattern);

        if (preg_match('#^' . $pattern . '$#', $route, $matches)) {
            array_shift($matches);
            $params = array_combine($paramNames, $matches);
            return $file;
        }
    }
    return false;
}

$params = [];

$file_to_include = match_route($route, $api_routes[$method], $params);

foreach ($params as $key => $value) {
    $params[$key] = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

if (!$file_to_include) {
    http_response_code(404);
    echo json_encode(['status' => 'Not found', 'message' => 'Route not found']);
    die();
}

include $file_to_include;
