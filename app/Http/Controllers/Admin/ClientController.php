<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ClientController extends Controller
{
    public function index()
    {
        $clients = User::where('role', 'customer')
            ->withCount('orders')
            ->withSum(['orders as total_spent' => function ($query) {
                $query->where('status', 'completed');
            }], 'total')
            ->with(['orders' => function ($query) {
                $query->latest()->take(5)->with('items.product');
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Clients/Index', [
            'clients' => $clients
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|string|email|max:255|unique:users',
            'address' => 'nullable|string|max:255',
            'neighborhood' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? 'cliente_' . Str::random(5) . '@flamegas.com',
            'password' => Hash::make(Str::random(10)),
            'phone' => $validated['phone'],
            'address' => $validated['address'] ?? null,
            'neighborhood' => $validated['neighborhood'] ?? null,
            'city' => $validated['city'] ?? null,
        ]);
        
        $user->role = 'customer';
        $user->save();

        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $client = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|string|email|max:255|unique:users,email,'.$client->id,
            'address' => 'nullable|string|max:255',
            'neighborhood' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
        ]);

        $client->update($validated);

        return redirect()->back();
    }

    public function destroy($id)
    {
        $client = User::findOrFail($id);
        $client->delete();

        return redirect()->back();
    }
}
