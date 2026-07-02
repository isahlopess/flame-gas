<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $notifications = [];
        
        if ($user = $request->user()) {
            if ($user->role === 'customer') {
                $notifications = \App\Models\Order::where('user_id', $user->id)
                    ->where(function ($query) {
                        $query->whereIn('status', ['pending', 'en_route', 'accepted'])
                              ->orWhere(function ($q) {
                                  $q->where('status', 'completed')
                                    ->whereNull('rating');
                              });
                    })
                    ->orderBy('created_at', 'desc')
                    ->with('items.product')
                    ->get();
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'notifications' => $notifications,
        ];
    }
}
