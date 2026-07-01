<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Route;

class TelemetryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        DB::listen(function ($query) {
            Log::info('Database Query Execution', [
                'sql' => $query->sql,
                'bindings' => $query->bindings,
                'time_ms' => $query->time,
            ]);
        });

        Event::listen(\Illuminate\Cache\Events\CacheHit::class, function ($event) {
            Log::info('Cache Hit', [
                'key' => $event->key,
                'tags' => $event->tags,
            ]);
        });

        Event::listen(\Illuminate\Cache\Events\CacheMissed::class, function ($event) {
            Log::info('Cache Missed', [
                'key' => $event->key,
                'tags' => $event->tags,
            ]);
        });

        Route::get('/api/health', function () {
            try {
                DB::connection()->getPdo();
                $dbStatus = 'connected';
            } catch (\Exception $e) {
                $dbStatus = 'disconnected';
            }

            return response()->json([
                'status' => 'ok',
                'database' => $dbStatus,
                'memory_usage_mb' => round(memory_get_usage(true) / 1024 / 1024, 2),
                'execution_time_ms' => defined('LARAVEL_START') ? round((microtime(true) - \LARAVEL_START) * 1000, 2) : 0,
                'timestamp' => now()->toIso8601String(),
            ]);
        });
    }
}
