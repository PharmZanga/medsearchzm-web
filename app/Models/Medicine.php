<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Medicine extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'generic_name',
        'brand_name',
        'strength',
        'dosage_form',
        'category',
        'description',
        'prescription_required',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'prescription_required' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class, 'facility_medicines')
            ->withPivot(['price', 'stock_quantity', 'stock_status', 'last_verified_at'])
            ->withTimestamps();
    }
}
