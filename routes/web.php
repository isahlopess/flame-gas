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
        'products' => Product::where('active', true)->get(),
    ]);
});

use App\Http\Controllers\OrderController;

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('/api/orders', [OrderController::class, 'store'])->name('api.orders.store');

Route::middleware(['auth', RoleMiddleware::class . ':employee,manager'])->prefix('hub')->group(function () {
    Route::get('/', function () {
        $user = auth()->user();
        $orders = Order::where('driver_id', $user->id)
                      ->whereIn('status', ['en_route', 'accepted'])
                      ->with('items.product')
                      ->get();

        return Inertia::render('Hub/Dashboard', [
            'orders' => $orders,
            'queue' => Order::where('status', 'pending')->with('items.product')->get(),
        ]);
    })->name('hub.dashboard');

    Route::get('/queue', function () {
        return Inertia::render('Hub/Queue', [
            'queue' => Order::where('status', 'pending')->with('items.product')->get()
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
});

Route::middleware(['auth', RoleMiddleware::class . ':manager'])->prefix('admin')->group(function () {
    Route::get('/', function () {
        $ordersCount = Order::count();
        $revenue = Order::where('status', 'completed')->sum('total');
        $customersCount = User::where('role', 'customer')->count();
        $recentOrders = Order::with(['user', 'driver'])->orderBy('created_at', 'desc')->take(4)->get();

        $statusCounts = Order::select('status', \DB::raw('count(*) as total'))->groupBy('status')->get();
        $statusData = $statusCounts->map(function ($item) {
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
                'name' => $names[$item->status] ?? $item->status,
                'value' => $item->total,
                'color' => $colors[$item->status] ?? '#94a3b8'
            ];
        });

        $topDrivers = User::where('role', 'employee')
            ->withCount(['driverOrders as deliveries' => function ($query) {
                $query->where('status', 'completed');
            }])
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
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dayRevenue = Order::where('status', 'completed')
                ->whereDate('created_at', $date)
                ->sum('total');
            $revenueChartData[] = [
                'name' => $date->format('d M'),
                'value' => $dayRevenue
            ];
        }

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'ordersCount' => $ordersCount,
                'revenue' => $revenue,
                'customersCount' => $customersCount,
                'deliveriesToday' => Order::whereDate('created_at', Carbon::today())->count(),
            ],
            'recentOrders' => $recentOrders,
            'statusData' => $statusData,
            'topDrivers' => $topDrivers,
            'revenueData' => $revenueChartData,
        ]);
    })->name('admin.dashboard');

    Route::get('/orders', function () {
        return Inertia::render('Admin/Orders/Index', [
            'orders' => Order::with(['user', 'driver', 'items.product'])->orderBy('created_at', 'desc')->get()
        ]);
    })->name('admin.orders');

    Route::get('/clients', function () {
        return Inertia::render('Admin/Clients/Index', [
            'clients' => User::where('role', 'customer')
                            ->withCount('orders')
                            ->orderBy('created_at', 'desc')
                            ->get()
        ]);
    })->name('admin.clients');

    Route::get('/drivers', function () {
        return Inertia::render('Admin/Drivers/Index', [
            'drivers' => User::where('role', 'employee')
                            ->withCount(['driverOrders as deliveries' => function ($query) {
                                $query->where('status', 'completed');
                            }])
                            ->orderBy('created_at', 'desc')
                            ->get()
        ]);
    })->name('admin.drivers');

    Route::get('/inventory', function () {
        return Inertia::render('Admin/Inventory/Index', [
            'products' => Product::orderBy('name')->get()
        ]);
    })->name('admin.inventory');

    Route::get('/revenue', function () {
        $revenueDetails = Order::where('status', 'completed')->orderBy('created_at', 'desc')->get();
        $totalRevenue = $revenueDetails->sum('total');

        $paymentMethodsData = Order::where('status', 'completed')
            ->select('payment_method', \DB::raw('count(*) as total'))
            ->groupBy('payment_method')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->payment_method ?: 'Outros',
                    'value' => $item->total
                ];
            });

        $totalPayments = $paymentMethodsData->sum('value');
        $paymentMethods = $paymentMethodsData->map(function ($item) use ($totalPayments) {
            return [
                'name' => $item['name'],
                'value' => $totalPayments > 0 ? round(($item['value'] / $totalPayments) * 100) : 0
            ];
        });

        $revenueChartData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::today()->subMonths($i);
            $monthRevenue = Order::where('status', 'completed')
                ->whereMonth('created_at', $month->month)
                ->whereYear('created_at', $month->year)
                ->sum('total');
            $revenueChartData[] = [
                'name' => $month->format('M'),
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
