<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable()->unique();
            $table->string('phone')->nullable()->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('phone_verified_at')->nullable();
            $table->string('password');
            $table->string('account_type')->default('patient')->index();
            $table->string('status')->default('active')->index();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('facilities', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('type')->index();
            $table->string('license_number')->nullable()->unique();
            $table->string('province')->index();
            $table->string('district')->index();
            $table->string('address');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->json('operating_hours')->nullable();
            $table->string('verification_status')->default('pending')->index();
            $table->boolean('is_open_24_hours')->default(false);
            $table->boolean('offers_delivery')->default(false);
            $table->boolean('is_active')->default(false)->index();
            $table->timestamps();
        });

        Schema::create('medicines', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('generic_name')->index();
            $table->string('brand_name')->nullable()->index();
            $table->string('strength')->nullable();
            $table->string('dosage_form')->nullable();
            $table->string('category')->index();
            $table->text('description')->nullable();
            $table->boolean('prescription_required')->default(false);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('medical_services', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category')->index();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('facility_medicines', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('facility_id')->constrained()->cascadeOnDelete();
            $table->foreignId('medicine_id')->constrained()->cascadeOnDelete();
            $table->decimal('price', 12, 2)->nullable();
            $table->unsignedInteger('stock_quantity')->nullable();
            $table->string('stock_status')->default('unknown')->index();
            $table->timestamp('last_verified_at')->nullable();
            $table->timestamps();
            $table->unique(['facility_id', 'medicine_id']);
        });

        Schema::create('facility_services', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('facility_id')->constrained()->cascadeOnDelete();
            $table->foreignId('medical_service_id')->constrained()->cascadeOnDelete();
            $table->decimal('price', 12, 2)->nullable();
            $table->boolean('booking_required')->default(false);
            $table->boolean('is_available')->default(true)->index();
            $table->timestamps();
            $table->unique(['facility_id', 'medical_service_id']);
        });

        Schema::create('personal_access_tokens', function (Blueprint $table): void {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('facility_services');
        Schema::dropIfExists('facility_medicines');
        Schema::dropIfExists('medical_services');
        Schema::dropIfExists('medicines');
        Schema::dropIfExists('facilities');
        Schema::dropIfExists('users');
    }
};
