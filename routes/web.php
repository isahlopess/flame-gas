<?php

use App\Http\Controllers\ProfileController;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'products' => Product::where('active', true)->orderBy('display_order', 'asc')->get(),
    ]);
});

use App\Http\Controllers\OrderController;

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('/api/orders', [OrderController::class, 'store'])->name('api.orders.store');
Route::post('/api/orders/{id}/rate', [OrderController::class, 'rate'])->name('api.orders.rate')->middleware('auth');
Route::post('/api/orders/{id}/accept', [OrderController::class, 'accept'])->name('api.orders.accept')->middleware('auth');
Route::post('/api/orders/{id}/complete', [OrderController::class, 'complete'])->name('api.orders.complete')->middleware('auth');

Route::middleware(['auth', RoleMiddleware::class . ':employee,manager'])->prefix('hub')->group(function () {
    Route::get('/', function () {
        $period = request('period', 'week');
        $user = auth()->user();

        $orders = Order::where('driver_id', $user->id)
                      ->whereIn('status', ['en_route', 'accepted'])
                      ->with('items.product')
                      ->get();

        $startDate = now();
        $groupType = 'day';

        if ($period === 'today') {
            $startDate = now()->startOfDay();
            $groupType = 'hour';
        } elseif ($period === 'month') {
            $startDate = now()->subDays(29)->startOfDay();
        } else {
            $startDate = now()->subDays(6)->startOfDay();
        }

        $completedOrders = Order::where('driver_id', $user->id)
                             ->where('status', 'completed')
                             ->where('created_at', '>=', $startDate)
                             ->with('user')
                             ->get();

        $allTimeAvgRating = Order::where('driver_id', $user->id)->whereNotNull('rating')->avg('rating');

        $kpis = [
            'count' => $completedOrders->count(),
            'revenue' => (float) $completedOrders->sum('total'),
            'rating' => $allTimeAvgRating !== null ? round($allTimeAvgRating, 1) : 0.0,
            'en_route' => $orders->count(),
        ];

        $periodData = [];
        if ($groupType === 'hour') {
            $currentHour = now()->hour;
            if ($currentHour < 12) {
                $periods = [
                    ['name' => '07h-08h', 'start' => 7, 'end' => 7],
                    ['name' => '08h-09h', 'start' => 8, 'end' => 8],
                    ['name' => '09h-10h', 'start' => 9, 'end' => 9],
                    ['name' => '10h-11h', 'start' => 10, 'end' => 10],
                    ['name' => '11h-12h', 'start' => 11, 'end' => 11],
                ];
            } else {
                $periods = [
                    ['name' => '07h-09h', 'start' => 7, 'end' => 8],
                    ['name' => '09h-11h', 'start' => 9, 'end' => 10],
                    ['name' => '11h-13h', 'start' => 11, 'end' => 12],
                    ['name' => '13h-15h', 'start' => 13, 'end' => 14],
                    ['name' => '15h-17h', 'start' => 15, 'end' => 16],
                    ['name' => '17h-19h', 'start' => 17, 'end' => 18],
                    ['name' => '19h-21h', 'start' => 19, 'end' => 20],
                ];
            }
            foreach ($periods as $p) {
                if ($p['start'] > $currentHour) break;
                
                $pOrders = $completedOrders->filter(function($o) use ($p) {
                    $h = $o->created_at->hour;
                    return $h >= $p['start'] && $h <= $p['end'];
                });
                $periodAvgRating = $pOrders->whereNotNull('rating')->avg('rating');
                $periodData[] = [
                    'day' => $p['name'],
                    'count' => $pOrders->count(),
                    'revenue' => (float) $pOrders->sum('total'),
                    'rating' => $periodAvgRating !== null ? round($periodAvgRating, 1) : 0.0
                ];
            }
        } elseif ($period === 'month') {
            $dayOfWeekStats = array_fill(0, 7, ['count' => 0, 'revenue' => 0, 'days_in_period' => 0, 'rating_sum' => 0, 'rating_count' => 0]);
            for ($i = 0; $i < 30; $i++) {
                $date = now()->subDays(29 - $i);
                $dayOfWeekStats[$date->dayOfWeek]['days_in_period']++;
            }

            foreach ($completedOrders as $order) {
                $dayOfWeekStats[$order->created_at->dayOfWeek]['count']++;
                $dayOfWeekStats[$order->created_at->dayOfWeek]['revenue'] += $order->total;
                if ($order->rating !== null) {
                    $dayOfWeekStats[$order->created_at->dayOfWeek]['rating_sum'] += $order->rating;
                    $dayOfWeekStats[$order->created_at->dayOfWeek]['rating_count']++;
                }
            }

            for ($i = 0; $i < 7; $i++) {
                $date = now()->subDays(6 - $i);
                $dayIndex = $date->dayOfWeek;
                $stats = $dayOfWeekStats[$dayIndex];
                $div = $stats['days_in_period'] ?: 1;

                $avgRating = $stats['rating_count'] > 0 ? $stats['rating_sum'] / $stats['rating_count'] : 0.0;

                $periodData[] = [
                    'day' => $date->locale('pt_BR')->isoFormat('ddd'),
                    'count' => round($stats['count'] / $div, 1),
                    'revenue' => (float) round($stats['revenue'] / $div, 2),
                    'rating' => round($avgRating, 1),
                ];
            }
        } else {
            $days = 7;
            for ($i = 0; $i < $days; $i++) {
                $date = now()->subDays($days - 1 - $i);
                $dayOrders = $completedOrders->where('created_at', '>=', $date->copy()->startOfDay())
                                          ->where('created_at', '<=', $date->copy()->endOfDay());

                $dayAvgRating = $dayOrders->whereNotNull('rating')->avg('rating');

                $periodData[] = [
                    'day' => $date->locale('pt_BR')->isoFormat('ddd'),
                    'count' => $dayOrders->count(),
                    'revenue' => (float) $dayOrders->sum('total'),
                    'rating' => $dayAvgRating !== null ? round($dayAvgRating, 1) : 0.0,
                ];
            }
        }

        return Inertia::render('Hub/Dashboard', [
            'orders' => $orders,
            'queue' => Order::where('status', 'pending')->with(['items.product', 'user'])->get(),
            'weeklyData' => $periodData,
            'recentHistory' => $completedOrders->sortByDesc('created_at')->take(5)->values(),
            'kpis' => $kpis,
            'currentPeriod' => $period,
        ]);
    })->name('hub.dashboard');

    Route::get('/queue', function () {
        return Inertia::render('Hub/Queue', [
            'queue' => Order::where('status', 'pending')->with(['items.product', 'user'])->get(),
            'activeOrders' => Order::where('driver_id', auth()->id())
                ->whereIn('status', ['en_route', 'accepted'])
                ->with(['items.product', 'user'])
                ->get()
        ]);
    })->name('hub.queue');

    Route::get('/history', function () {
        $user = auth()->user();
        return Inertia::render('Hub/History', [
            'history' => Order::where('driver_id', $user->id)
                              ->whereIn('status', ['completed', 'cancelled'])
                              ->with('items.product')
                              ->get()
        ]);
    })->name('hub.history');

    Route::get('/profile', function () {
        return Inertia::render('Hub/Profile', [
            'mustVerifyEmail' => auth()->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
            'status' => session('status'),
        ]);
    })->name('hub.profile.edit');
});

Route::middleware(['auth', RoleMiddleware::class . ':manager'])->prefix('admin')->group(function () {
    Route::get('/', function () {
        $period = request('period', 'today');

        $startDate = now();
        if ($period === 'today') {
            $startDate = now()->startOfDay();
            $prevStartDate = now()->subDay()->startOfDay();
            $prevEndDate = now()->subDay()->endOfDay();
        } elseif ($period === 'week') {
            $startDate = now()->subDays(6)->startOfDay();
            $prevStartDate = now()->subDays(13)->startOfDay();
            $prevEndDate = now()->subDays(7)->endOfDay();
        } elseif ($period === 'month') {
            $startDate = now()->subDays(29)->startOfDay();
            $prevStartDate = now()->subDays(59)->startOfDay();
            $prevEndDate = now()->subDays(30)->endOfDay();
        } else {
            $period = 'today';
            $startDate = now()->startOfDay();
            $prevStartDate = now()->subDay()->startOfDay();
            $prevEndDate = now()->subDay()->endOfDay();
        }

        $baseQuery = Order::where('created_at', '>=', $startDate);
        $prevBaseQuery = Order::where('created_at', '>=', $prevStartDate)->where('created_at', '<=', $prevEndDate);

        $ordersCount = (clone $baseQuery)->count();
        $prevOrdersCount = (clone $prevBaseQuery)->count();

        $revenue = (clone $baseQuery)->where('status', 'completed')->sum('total');
        $prevRevenue = (clone $prevBaseQuery)->where('status', 'completed')->sum('total');

        $customersCount = (clone $baseQuery)->distinct('user_id')->count('user_id');
        $prevCustomersCount = (clone $prevBaseQuery)->distinct('user_id')->count('user_id');

        $deliveriesToday = (clone $baseQuery)->where('status', 'completed')->count();
        $prevDeliveries = (clone $prevBaseQuery)->where('status', 'completed')->count();

        $calcTrend = function ($curr, $prev) {
            if ($prev == 0) return $curr > 0 ? 100 : 0;
            return round((($curr - $prev) / $prev) * 100, 1);
        };

        $recentOrders = (clone $baseQuery)->with(['user', 'driver'])->orderBy('created_at', 'desc')->take(4)->get();

        $statusCounts = (clone $baseQuery)->select('status', \DB::raw('count(*) as total'))->groupBy('status')->get();
        $statusData = collect(['completed', 'en_route', 'pending', 'cancelled'])->map(function ($status) use ($statusCounts) {
            $item = $statusCounts->firstWhere('status', $status);
            $colors = [
                'completed' => '#10b981',
                'en_route' => '#f97316',
                'pending' => '#eab308',
                'cancelled' => '#ef4444'
            ];
            $names = [
                'completed' => 'Concluídos',
                'en_route' => 'Em Rota',
                'pending' => 'Pendentes',
                'cancelled' => 'Cancelados'
            ];
            return [
                'name' => $names[$status],
                'value' => $item ? $item->total : 0,
                'color' => $colors[$status]
            ];
        });

        $topDrivers = User::where('role', 'employee')
            ->withCount(['driverOrders as deliveries' => function ($query) use ($startDate) {
                $query->where('status', 'completed')->where('created_at', '>=', $startDate);
            }])
            ->having('deliveries', '>', 0)
            ->orderByDesc('deliveries')
            ->take(3)
            ->get()
            ->map(function ($driver) {
                return [
                    'name' => $driver->name,
                    'deliveries' => $driver->deliveries,
                    'rating' => 5.0,
                ];
            });

        $revenueChartData = [];
        if ($period === 'today') {
            $currentHour = now()->hour;
            if ($currentHour < 12) {
                $periods = [
                    ['name' => '07h-08h', 'start' => 7, 'end' => 7],
                    ['name' => '08h-09h', 'start' => 8, 'end' => 8],
                    ['name' => '09h-10h', 'start' => 9, 'end' => 9],
                    ['name' => '10h-11h', 'start' => 10, 'end' => 10],
                    ['name' => '11h-12h', 'start' => 11, 'end' => 11],
                ];
            } else {
                $periods = [
                    ['name' => '07h-09h', 'start' => 7, 'end' => 8],
                    ['name' => '09h-11h', 'start' => 9, 'end' => 10],
                    ['name' => '11h-13h', 'start' => 11, 'end' => 12],
                    ['name' => '13h-15h', 'start' => 13, 'end' => 14],
                    ['name' => '15h-17h', 'start' => 15, 'end' => 16],
                    ['name' => '17h-19h', 'start' => 17, 'end' => 18],
                    ['name' => '19h-21h', 'start' => 19, 'end' => 20],
                ];
            }

            $completedToday = Order::where('status', 'completed')
                ->whereDate('created_at', Carbon::today())
                ->get();

            foreach ($periods as $p) {
                if ($p['start'] > $currentHour) break;
                
                $pOrders = $completedToday->filter(function($o) use ($p) {
                    $h = $o->created_at->hour;
                    return $h >= $p['start'] && $h <= $p['end'];
                });

                $revenueChartData[] = [
                    'name' => $p['name'],
                    'value' => (float) $pOrders->sum('total')
                ];
            }
        } elseif ($period === 'week') {
            for ($i = 6; $i >= 0; $i--) {
                $date = Carbon::today()->subDays($i);
                $val = Order::where('status', 'completed')->whereDate('created_at', $date)->sum('total');
                $revenueChartData[] = ['name' => $date->format('d M'), 'value' => $val];
            }
        } else {
            for ($i = 29; $i >= 0; $i--) {
                $date = Carbon::today()->subDays($i);
                $val = Order::where('status', 'completed')->whereDate('created_at', $date)->sum('total');
                if ($i % 5 === 0 || $i === 0) {
                    $revenueChartData[] = ['name' => $date->format('d M'), 'value' => $val];
                }
            }
        }

        $notifications = Order::with(['user', 'driver'])
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($order) {
                if ($order->status === 'completed') {
                    $msg = "Entregador " . ($order->driver->name ?? 'N/A') . " finalizou a rota.";
                    $title = "Pedido Entregue";
                } elseif ($order->status === 'en_route') {
                    $msg = "Entregador " . ($order->driver->name ?? 'N/A') . " está a caminho.";
                    $title = "Pedido em Rota";
                } elseif ($order->status === 'pending') {
                    $msg = "Novo pedido de " . ($order->user->name ?? $order->address) . " recebido!";
                    $title = "Novo Pedido";
                } else {
                    $msg = "Pedido #" . $order->id . " foi cancelado.";
                    $title = "Pedido Cancelado";
                }
                return [
                    'id' => $order->id,
                    'title' => $title,
                    'message' => $msg,
                    'time' => $order->updated_at->diffForHumans(),
                    'timestamp' => $order->updated_at->timestamp * 1000,
                    'is_read' => false,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'ordersCount' => $ordersCount,
                'ordersTrend' => $calcTrend($ordersCount, $prevOrdersCount),
                'revenue' => $revenue,
                'revenueTrend' => $calcTrend($revenue, $prevRevenue),
                'customersCount' => $customersCount,
                'customersTrend' => $calcTrend($customersCount, $prevCustomersCount),
                'deliveriesToday' => $deliveriesToday,
                'deliveriesTrend' => $calcTrend($deliveriesToday, $prevDeliveries),
            ],
            'recentOrders' => $recentOrders,
            'statusData' => $statusData,
            'topDrivers' => $topDrivers,
            'revenueData' => $revenueChartData,
            'currentPeriod' => $period,
            'notifications' => $notifications,
        ]);
    })->name('admin.dashboard');

    Route::get('/orders', function () {
        return Inertia::render('Admin/Orders/Index', [
            'orders' => Order::with(['user', 'driver', 'items.product'])->orderBy('created_at', 'desc')->get(),
            'drivers' => User::where('role', 'employee')->orderBy('name')->get()
        ]);
    })->name('admin.orders');

    Route::post('/orders/{id}/update-status', function (Illuminate\Http\Request $request, $id) {
        $order = Order::findOrFail($id);
        if ($request->has('status')) $order->status = $request->status;
        if ($request->has('driver_id')) $order->driver_id = $request->driver_id;
        $order->save();
        return redirect()->back();
    })->name('admin.orders.update_status');

    Route::get('/clients', function () {
        return Inertia::render('Admin/Clients/Index', [
            'clients' => User::where('role', 'customer')
                            ->withCount('orders')
                            ->orderBy('created_at', 'desc')
                            ->get()
        ]);
    })->name('admin.clients');

    Route::get('/drivers', [App\Http\Controllers\Admin\DriverController::class, 'index'])->name('admin.drivers');
    Route::post('/drivers/invite', [App\Http\Controllers\Admin\DriverController::class, 'generateInvite'])->name('admin.drivers.invite');
    Route::put('/drivers/{id}', [App\Http\Controllers\Admin\DriverController::class, 'update'])->name('admin.drivers.update');
    Route::delete('/drivers/{id}', [App\Http\Controllers\Admin\DriverController::class, 'destroy'])->name('admin.drivers.destroy');

    Route::get('/inventory', function () {
        return Inertia::render('Admin/Inventory/Index', [
            'products' => Product::orderBy('display_order', 'asc')->get()
        ]);
    })->name('admin.inventory');

    Route::post('/products', [\App\Http\Controllers\ProductController::class, 'store'])->name('admin.products.store');
    Route::post('/products/{id}', [\App\Http\Controllers\ProductController::class, 'update'])->name('admin.products.update');
    Route::delete('/products/{id}', [\App\Http\Controllers\ProductController::class, 'destroy'])->name('admin.products.destroy');
    Route::post('/products-reorder', [\App\Http\Controllers\ProductController::class, 'reorder'])->name('admin.products.reorder');

    Route::get('/revenue/export-pdf', [\App\Http\Controllers\RevenueExportController::class, 'exportPdf'])->name('admin.revenue.export.pdf');
    Route::get('/revenue/export-csv', [\App\Http\Controllers\RevenueExportController::class, 'exportCsv'])->name('admin.revenue.export.csv');

    Route::get('/revenue', function () {
        $revenueDetails = Order::where('status', 'completed')->orderBy('created_at', 'desc')->get();
        $totalRevenue = $revenueDetails->sum('total');

        $baseMethods = [
            'Pix' => 0,
            'Cartão de Crédito' => 0,
            'Cartão de Débito' => 0,
            'Dinheiro' => 0,
        ];

        $paymentMethodsData = Order::where('status', 'completed')
            ->select('payment_method', \DB::raw('count(*) as total'))
            ->groupBy('payment_method')
            ->get();

        foreach ($paymentMethodsData as $item) {
            $rawName = strtolower($item->payment_method ?: 'outros');
            $name = 'Outros';
            
            if (str_contains($rawName, 'pix')) $name = 'Pix';
            elseif (str_contains($rawName, 'credito') || str_contains($rawName, 'crédito')) $name = 'Cartão de Crédito';
            elseif (str_contains($rawName, 'debito') || str_contains($rawName, 'débito')) $name = 'Cartão de Débito';
            elseif (str_contains($rawName, 'dinheiro') || str_contains($rawName, 'especie')) $name = 'Dinheiro';

            if (isset($baseMethods[$name])) {
                $baseMethods[$name] += $item->total;
            } else {
                $baseMethods['Outros'] = ($baseMethods['Outros'] ?? 0) + $item->total;
            }
        }

        $totalPayments = array_sum($baseMethods);
        
        $paymentMethods = collect($baseMethods)->map(function ($total, $name) use ($totalPayments) {
            return [
                'name' => $name,
                'value' => $totalPayments > 0 ? round(($total / $totalPayments) * 100) : 0,
                'raw_count' => $total
            ];
        })->sortByDesc('raw_count')->values()->toArray();

        $revenueChartData = [];
        $meses = [
            1 => 'Jan', 2 => 'Fev', 3 => 'Mar', 4 => 'Abr', 5 => 'Mai', 6 => 'Jun',
            7 => 'Jul', 8 => 'Ago', 9 => 'Set', 10 => 'Out', 11 => 'Nov', 12 => 'Dez'
        ];
        
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::today()->subMonths($i);
            $monthRevenue = Order::where('status', 'completed')
                ->whereMonth('created_at', $month->month)
                ->whereYear('created_at', $month->year)
                ->sum('total');
            $revenueChartData[] = [
                'name' => $meses[$month->month],
                'receita' => $monthRevenue,
                'despesa' => $monthRevenue * 0.6
            ];
        }

        return Inertia::render('Admin/Revenue/Index', [
            'revenueDetails' => $revenueDetails,
            'totalRevenue' => $totalRevenue,
            'paymentMethods' => $paymentMethods,
            'revenueChartData' => $revenueChartData
        ]);
    })->name('admin.revenue');
});

require __DIR__.'/auth.php';
