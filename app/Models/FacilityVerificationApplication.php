<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacilityVerificationApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'facility_id',
        'applicant_user_id',
        'status',
        'documents',
        'applicant_notes',
        'reviewer_notes',
        'reviewed_by',
        'submitted_at',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'documents' => 'array',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }

    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'applicant_user_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
