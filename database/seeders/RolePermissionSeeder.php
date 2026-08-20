<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            'view_users',
            'manage_users',
            'verify_workers',
            'verify_facilities',
            'manage_facilities',
            'manage_medicines',
            'manage_services',
            'moderate_community',
            'manage_appointments',
            'manage_billing',
            'view_analytics',
            'view_audit_logs',
            'manage_roles',
            'manage_system_settings',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        Role::findOrCreate('patient', 'web');
        Role::findOrCreate('health_worker', 'web');
        Role::findOrCreate('facility', 'web');

        Role::findOrCreate('verification_officer', 'web')->syncPermissions([
            'view_users',
            'verify_workers',
            'verify_facilities',
        ]);
        Role::findOrCreate('community_moderator', 'web')->syncPermissions(['moderate_community']);
        Role::findOrCreate('operations_manager', 'web')->syncPermissions([
            'manage_facilities',
            'manage_medicines',
            'manage_services',
            'manage_appointments',
        ]);
        Role::findOrCreate('finance_manager', 'web')->syncPermissions(['manage_billing', 'view_analytics']);
        Role::findOrCreate('data_analyst', 'web')->syncPermissions(['view_analytics']);
        Role::findOrCreate('super_admin', 'web')->syncPermissions($permissions);

        if (env('MEDSEARCH_ADMIN_EMAIL') && env('MEDSEARCH_ADMIN_PASSWORD')) {
            $admin = User::query()->updateOrCreate(
                ['email' => env('MEDSEARCH_ADMIN_EMAIL')],
                [
                    'name' => env('MEDSEARCH_ADMIN_NAME', 'MedSearch Administrator'),
                    'password' => Hash::make(env('MEDSEARCH_ADMIN_PASSWORD')),
                    'account_type' => 'administrator',
                    'status' => 'active',
                    'email_verified_at' => now(),
                ],
            );
            $admin->syncRoles(['super_admin']);
        }
    }
}
