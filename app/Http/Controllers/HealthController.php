<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class HealthController extends Controller
{
    public function index()
    {
        $status = 'healthy';
        $checks = [];

        try {
            DB::connection()->getPdo();
            $checks['database'] = 'ok';
        } catch (\Exception $e) {
            $checks['database'] = 'error';
            $status = 'unhealthy';
        }

        try {
            Cache::store()->get('health_check');
            $checks['cache'] = 'ok';
        } catch (\Exception $e) {
            $checks['cache'] = 'error';
            $status = 'unhealthy';
        }

        $diskSpace = function_exists('disk_free_space') ? disk_free_space('/') : 0;
        if ($diskSpace !== false && $diskSpace < 104857600) {
            $checks['storage'] = 'low_space';
        } else {
            $checks['storage'] = 'ok';
        }

        return response()->json([
            'status' => $status,
            'timestamp' => now()->toIso8601String(),
            'checks' => $checks,
        ], $status === 'healthy' ? 200 : 503);
    }
}
