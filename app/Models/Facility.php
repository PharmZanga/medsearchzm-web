<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Facility extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'owner_user_id',
        'slug',
        'type',
        'license_number',
        'province',
        'district',
        'address',
        'latitude',
        'longitude',
        'phone',
        'email',
        'operating_hours',
        'verification_status',
        'is_open_24_hours',
        'offers_delivery',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'operating_hours' => 'array',
            'is_open_24_hours' => 'boolean',
            'offers_delivery' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    public function verificationApplications(): HasMany
    {
        return $this->hasMany(FacilityVerificationApplication::class);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('is_active', true)
            ->where('verification_status', 'verified');
    }

    public function medicines(): BelongsToMany
    {
        return $this->belongsToMany(Medicine::class, 'facility_medicines')
            ->withPivot(['price', 'stock_quantity', 'stock_status', 'last_verified_at'])
            ->withTimestamps();
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(MedicalService::class, 'facility_services')
            ->withPivot(['price', 'booking_required', 'is_available'])
            ->withTimestamps();
    }
}
