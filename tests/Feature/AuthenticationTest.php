<?php

namespace Tests\Feature;

use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_user_can_register_and_receive_a_token(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Demo Patient',
            'phone' => '+260970000000',
            'password' => 'SecurePass123',
            'password_confirmation' => 'SecurePass123',
            'account_type' => 'patient',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('user.account_type', 'patient')
            ->assertJsonPath('user.roles.0', 'patient')
            ->assertJsonStructure(['token']);
    }

    public function test_public_registration_cannot_create_an_administrator(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $this->postJson('/api/v1/auth/register', [
            'name' => 'Unsafe Admin',
            'email' => 'unsafe@example.com',
            'password' => 'SecurePass123',
            'password_confirmation' => 'SecurePass123',
            'account_type' => 'administrator',
        ])->assertUnprocessable();
    }
}
