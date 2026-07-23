<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderCriticalFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_order_critical_flow()
    {
        $manager = User::factory()->create(['role' => 'manager']);
        $employee = User::factory()->create(['role' => 'employee']);
        $customer = User::factory()->create(['role' => 'customer']);

        $product = Product::create([
            'sku' => 'GAS-13KG',
            'name' => 'Gas',
            'description' => 'Gas cylinder',
            'price' => 100.00,
            'image' => 'gas.jpg',
            'category' => 'residential'
        ]);

        $orderResponse = $this->actingAs($customer)->postJson('/api/orders', [
            'name' => 'John Doe',
            'phone' => '123456789',
            'address' => '123 Main St',
            'neighborhood' => 'Downtown',
            'city' => 'Cityville',
            'payment_method' => 'Pix',
            'total' => 100,
            'items' => [
                ['id' => $product->id, 'quantity' => 1, 'price' => 100]
            ]
        ]);

        $orderResponse->assertStatus(200);
        $orderId = $orderResponse->json('order_id');
        $this->assertDatabaseHas('orders', ['id' => $orderId, 'status' => 'pending']);

        $acceptResponse = $this->actingAs($employee)->postJson("/api/orders/{$orderId}/accept");
        $acceptResponse->assertStatus(302); // Redirect back
        $this->assertDatabaseHas('orders', ['id' => $orderId, 'status' => 'en_route', 'driver_id' => $employee->id]);

        $completeResponse = $this->actingAs($employee)->postJson("/api/orders/{$orderId}/complete");
        $completeResponse->assertStatus(302);
        $this->assertDatabaseHas('orders', ['id' => $orderId, 'status' => 'completed']);
    }
}
