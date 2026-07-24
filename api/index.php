<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if ($_SERVER['REQUEST_URI'] === '/ping') {
    echo "pong";
    exit;
}

try {
    require __DIR__.'/../vendor/autoload.php';

    $app = require_once __DIR__.'/../bootstrap/app.php';

    $storagePath = '/tmp/storage';
    $app->useStoragePath($storagePath);

    $directories = [
        $storagePath . '/app/public',
        $storagePath . '/framework/cache/data',
        $storagePath . '/framework/sessions',
        $storagePath . '/framework/testing',
        $storagePath . '/framework/views',
        $storagePath . '/logs',
    ];

    foreach ($directories as $dir) {
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
    }

    $app->handleRequest(Request::capture());
} catch (\Throwable $e) {
    http_response_code(500);
    echo "<h1>FATAL PHP ERROR</h1>";
    echo "<b>Message:</b> " . $e->getMessage() . "<br><br>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}

