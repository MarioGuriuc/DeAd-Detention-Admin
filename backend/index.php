<?php

// Author: Mario Guriuc

require_once "vendor/autoload.php";
require_once "inc/jwt.php";
require_once "inc/get_db_conn.php";
require_once "inc/common.php";

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$route = $_GET['route'] ?? '';

$method = $_SERVER['REQUEST_METHOD'];

$api_routes = [
    'GET' => [
        'api/centers' => 'api/centers_service/get_detention_centers.php',
        'api/centers/count' => 'api/centers_service/get_centers_count.php',
        'api/centers/{page_number}' => 'api/centers_service/get_detention_centers.php',
        'api/centers/{center_id}/inmates' => 'api/inmates_service/get_inmates.php',
        'api/account/{username}' => 'api/user_service/get_account_info.php',
    ],
    'POST' => [
        'api/login' => 'api/user_service/login.php',
        'api/register' => 'api/user_service/register.php',
        'api/add-center' => 'api/centers_service/add_center.php',
    ],
    'PATCH' => [
        'api/account/{username}' => 'api/user_service/update_account.php',
    ],
    'DELETE' => [
        'api/account/{username}' => 'api/user_service/delete_account.php',
    ],
];

function match_route($route, $routes, &$params): bool|string
{
    foreach ($routes as $pattern => $file) {
        $pattern = preg_replace('/\{[a-zA-Z0-9_]+\}/', '([^/]+)', $pattern);
        if (preg_match('#^' . $pattern . '$#', $route, $matches)) {
            array_shift($matches);
            $params = $matches;
            return $file;
        }
    }
    return false;
}

$params = [];

$file_to_include = match_route($route, $api_routes[$method] ?? [], $params);

foreach ($params as $key => $value) {
    $params[$key] = $value;
}

header("Access-Control-Allow-Origin:" . $_ENV["FRONTEND_URL"]);
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!$file_to_include) {
    http_response_code(404);
    echo json_encode(['status' => 'Not found', 'message' => 'Route not found']);
    die();
}

include $file_to_include;
