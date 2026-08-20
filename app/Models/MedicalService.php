<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MedicalService extends Model
{
    use HasFactory;

    protected $table = 'medical_services';

    protected $fillable = [
        'name',
        'slug',
        'category',
        'description',
        'is_active',
    ];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class, 'facility_services')
            ->withPivot(['price', 'booking_required', 'is_available'])
            ->withTimestamps();
    }
}
