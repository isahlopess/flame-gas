<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',

            'name' => 'required|string',
            'phone' => 'required|string',
            'address' => 'required|string',
            'neighborhood' => 'required|string',
            'city' => 'required|string',
            'complement' => 'nullable|string',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string',
            'total' => 'required|numeric',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $order = Order::create([
                'user_id' => $request->user()?->id,
                'status' => 'pending',
                'total' => $validated['total'],
                'payment_method' => $validated['payment_method'],
                'notes' => $validated['notes'] ?? null,
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'neighborhood' => $validated['neighborhood'],
                'city' => $validated['city'],
                'complement' => $validated['complement'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                ]);
            }

            return response()->json([
                'success' => true,
                'order_id' => $order->id
            ]);
        });
    }

    public function rate(Request $request, $id)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'feedback' => 'nullable|string',
        ]);

        $order = Order::findOrFail($id);

        if ($order->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($order->status !== 'completed') {
            return response()->json(['error' => 'Only completed orders can be rated'], 422);
        }

        $order->update([
            'rating' => $validated['rating'],
            'feedback' => $validated['feedback'],
        ]);

        return response()->json(['success' => true]);
    }

    public function accept(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        if ($order->status !== 'pending') {
            return response()->json(['error' => 'Order is not pending'], 422);
        }

        $order->update([
            'status' => 'en_route',
            'driver_id' => $request->user()->id,
        ]);

        return redirect()->back();
    }

    public function complete(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        if ($order->status !== 'en_route' && $order->status !== 'accepted') {
            return response()->json(['error' => 'Order is not en_route'], 422);
        }

        if ($order->driver_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $order->update([
            'status' => 'completed',
        ]);

        return redirect()->back();
    }
}
