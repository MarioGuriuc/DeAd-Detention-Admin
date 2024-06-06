<?php

// Author: Mario Guriuc

$route = $_GET['route'] ?? '';

$web_routes = [
    '' => 'html/home.html',
    'login' => 'html/login.html',
    'register' => 'html/register.html',
    'add-center' => 'html/add_center.html',
    'add-inmate' => 'html/add_inmate.html',
    'centers' => 'html/detention_centers.html',
    'forgot-password' => 'html/forgot_password.html',
];

$dynamic_web_routes = [
    'account/{username}' => 'html/account.html',
    'account/{username}/edit-account' => 'html/edit_account.html',
    'account/{username}/delete-account' => 'html/delete_account.html',
    'account/{username}/admin-page' => 'html/admin_page.html',
    'account/{username}/change-password' => 'html/change_password.html',
    'centers' => 'html/detention_centers.html',
    'centers/{page_number}' => 'html/detention_centers.html',
    'centers/{center_id}/inmates' => 'html/inmates.html',
    'centers/{center_id}/inmates/{inmate_id}' => 'html/inmates.html',
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

$file_to_include = match_route($route, $dynamic_web_routes, $params);

if (!$file_to_include && array_key_exists($route, $web_routes)) {
    $file_to_include = $web_routes[$route];
}

if (!$file_to_include) {
    http_response_code(404);
    include 'html/404.html';
    exit();
}

include $file_to_include;
