<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\InviteCode;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DriverController extends Controller
{
    public function index()
    {
        $drivers = User::where('role', 'employee')
            ->withCount(['driverOrders as deliveries' => function ($query) {
                $query->where('status', 'completed');
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        $inviteCodes = InviteCode::where('role', 'employee')
            ->with('user:id,name')
            ->latest()
            ->get();

        return Inertia::render('Admin/Drivers/Index', [
            'drivers' => $drivers,
            'inviteCodes' => $inviteCodes,
        ]);
    }

    public function generateInvite(Request $request)
    {
        InviteCode::create([
            'code' => strtoupper(Str::random(6)),
            'role' => 'employee',
        ]);

        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $driver = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$driver->id,
            'phone' => 'nullable|string|max:20',
            'vehicle_type' => 'nullable|string|max:50',
            'vehicle_plate' => 'nullable|string|max:20',
        ]);

        $driver->update($validated);

        return redirect()->back();
    }

    public function destroy($id)
    {
        $driver = User::findOrFail($id);
        $driver->delete();

        return redirect()->back();
    }
}
