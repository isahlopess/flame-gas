<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class CriticalFlowsTest extends TestCase
{
    use RefreshDatabase;

    public function test_health_endpoint_returns_ok_with_telemetry(): void
    {
        $response = $this->get('/api/health');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'status',
            'database',
            'memory_usage_mb',
            'execution_time_ms',
        ]);

        $this->assertEquals('ok', $response->json('status'));
    }

    public function test_telemetry_middleware_injects_request_id(): void
    {
        $response = $this->get('/');

        $response->assertHeader('X-Request-ID');
    }

    public function test_user_can_view_welcome_page(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }
}
