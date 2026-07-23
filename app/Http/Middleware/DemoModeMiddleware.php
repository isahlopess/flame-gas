<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DemoModeMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && in_array($user->email, ['gestor@flamegas.com', 'entregador@flamegas.com'])) {
            $isMutating = in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE']);

            if ($isMutating && !$request->is('logout')) {
                if ($request->expectsJson() || $request->is('api/*')) {
                    return response()->json(['error' => 'Ação não permitida em modo de demonstração.'], 403);
                }
                abort(403, 'Ação não permitida em modo de demonstração.');
            }
        }

        return $next($request);
    }
}
