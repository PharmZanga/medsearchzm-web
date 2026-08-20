<?php

namespace Tests\Feature;

use App\Models\Facility;
use App\Models\FacilityVerificationApplication;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FacilityVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_facility_account_can_submit_and_officer_can_approve_an_application(): void
    {
        Storage::fake('local');
        $this->seed(RolePermissionSeeder::class);

        $facilityUser = User::factory()->create(['account_type' => 'facility']);
        $facilityUser->assignRole('facility');
        Sanctum::actingAs($facilityUser);

        $this->postJson('/api/v1/facility-verifications', [
            'name' => 'Demo Community Pharmacy',
            'type' => 'pharmacy',
            'license_number' => 'DEMO-LIC-001',
            'province' => 'Lusaka',
            'district' => 'Lusaka',
            'address' => 'Demonstration address',
            'phone' => '+260970000001',
            'documents' => [UploadedFile::fake()->create('license.pdf', 100, 'application/pdf')],
        ])->assertCreated();

        $facility = Facility::query()->firstOrFail();
        $this->assertFalse($facility->is_active);

        $officer = User::factory()->create(['account_type' => 'administrator']);
        $officer->assignRole('verification_officer');
        Sanctum::actingAs($officer);

        $application = FacilityVerificationApplication::query()->firstOrFail();
        $this->patchJson("/api/v1/admin/facility-verifications/{$application->id}/review", [
            'decision' => 'approved',
            'reviewer_notes' => 'Documents validated for automated test.',
        ])->assertOk();

        $this->assertTrue($facility->fresh()->is_active);
        $this->assertSame('approved', $facility->fresh()->verification_status);
    }

    public function test_patient_cannot_access_the_admin_verification_queue(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $patient = User::factory()->create(['account_type' => 'patient']);
        $patient->assignRole('patient');
        Sanctum::actingAs($patient);

        $this->getJson('/api/v1/admin/facility-verifications')->assertForbidden();
    }
}
