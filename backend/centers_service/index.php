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
        'api/centers' => 'api/get_centers.php',
        'api/center/{center_id}' => 'api/get_center.php',
        'api/centers/count' => 'api/get_centers_count.php',
        'api/centers/page/{page_number}' => 'api/get_centers_page.php',
    ],
    'PATCH' => [
        'api/centers/{center_id}/edit' => 'api/edit_center.php',//Vlad
    ],
    'DELETE' => [
        'api/centers/{center_id}/delete' => 'api/delete_center.php',//Vlad
    ],
    'PUT' => [
        'api/centers' => 'api/add_center.php',
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
