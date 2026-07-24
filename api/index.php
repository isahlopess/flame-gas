<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if ($_SERVER['REQUEST_URI'] === '/ping') {
    echo "pong";
    exit;
}

$storagePath = '/tmp/storage';
$directories = [
    $storagePath . '/app/public',
    $storagePath . '/framework/cache/data',
    $storagePath . '/framework/sessions',
    $storagePath . '/framework/testing',
    $storagePath . '/framework/views',
    $storagePath . '/logs',
    '/tmp/cache',
];
foreach ($directories as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

$_SERVER['APP_CONFIG_CACHE']  = '/tmp/cache/config.php';
$_SERVER['APP_ROUTES_CACHE']  = '/tmp/cache/routes-v7.php';
$_SERVER['APP_EVENTS_CACHE']  = '/tmp/cache/events.php';
$_SERVER['APP_SERVICES_CACHE'] = '/tmp/cache/services.php';
$_SERVER['APP_PACKAGES_CACHE'] = '/tmp/cache/packages.php';

try {
    require __DIR__.'/../vendor/autoload.php';

    $app = require_once __DIR__.'/../bootstrap/app.php';
    $app->useStoragePath($storagePath);

    $app->handleRequest(Request::capture());
} catch (\Throwable $e) {
    http_response_code(500);
    echo "<h1>FATAL PHP ERROR</h1>";
    echo "<b>Message:</b> " . $e->getMessage() . "<br><br>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
