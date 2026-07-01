<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class TelemetryMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        $requestId = (string) Str::uuid();

        $request->headers->set('X-Request-ID', $requestId);

        Log::withContext([
            'request_id' => $requestId,
        ]);

        $response = $next($request);

        $response->headers->set('X-Request-ID', $requestId);

        $executionTime = microtime(true) - $startTime;
        $memoryUsage = memory_get_usage(true);

        Log::info('Request execution telemetry', [
            'execution_time_ms' => round($executionTime * 1000, 2),
            'memory_usage_bytes' => $memoryUsage,
            'url' => $request->fullUrl(),
            'method' => $request->method(),
        ]);

        return $response;
    }
}
