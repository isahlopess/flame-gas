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
                'notes' => $validated['notes'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'neighborhood' => $validated['neighborhood'],
                'city' => $validated['city'],
                'complement' => $validated['complement'],
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
}
