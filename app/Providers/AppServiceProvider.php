<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        \Illuminate\Validation\Rules\Password::defaults(function () {
            $rule = \Illuminate\Validation\Rules\Password::min(8)
                ->mixedCase()
                ->symbols();
            return $rule;
        });

        \Illuminate\Support\Facades\DB::listen(function (\Illuminate\Database\Events\QueryExecuted $query) {
            \Illuminate\Support\Facades\Log::info('Database Query', [
                'sql' => $query->sql,
                'bindings' => $query->bindings,
                'time_ms' => $query->time,
                'connection' => $query->connectionName,
            ]);
        });

        \Illuminate\Support\Facades\Event::listen(\Illuminate\Cache\Events\CacheHit::class, function ($event) {
            \Illuminate\Support\Facades\Log::info('Cache Hit', ['key' => $event->key]);
        });

        \Illuminate\Support\Facades\Event::listen(\Illuminate\Cache\Events\CacheMissed::class, function ($event) {
            \Illuminate\Support\Facades\Log::info('Cache Miss', ['key' => $event->key]);
        });
    }
}
