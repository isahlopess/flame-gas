<?php

use App\Http\Controllers\ProfileController;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', RoleMiddleware::class . ':employee,manager'])->prefix('hub')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Hub/Dashboard');
    })->name('hub.dashboard');

    Route::get('/queue', function () {
        return Inertia::render('Hub/Queue');
    })->name('hub.queue');

    Route::get('/history', function () {
        return Inertia::render('Hub/History');
    })->name('hub.history');
});

Route::middleware(['auth', RoleMiddleware::class . ':manager'])->prefix('admin')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');

    Route::get('/orders', function () {
        return Inertia::render('Admin/Orders/Index');
    })->name('admin.orders');

    Route::get('/clients', function () {
        return Inertia::render('Admin/Clients/Index');
    })->name('admin.clients');

    Route::get('/drivers', function () {
        return Inertia::render('Admin/Drivers/Index');
    })->name('admin.drivers');

    Route::get('/inventory', function () {
        return Inertia::render('Admin/Inventory/Index');
    })->name('admin.inventory');

    Route::get('/revenue', function () {
        return Inertia::render('Admin/Revenue/Index');
    })->name('admin.revenue');
});

require __DIR__.'/auth.php';
