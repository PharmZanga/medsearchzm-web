<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\FacilityVerificationApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class FacilityVerificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['nullable', Rule::in(['submitted', 'under_review', 'approved', 'rejected', 'more_information_requested'])],
        ]);

        return response()->json(
            FacilityVerificationApplication::query()
                ->with(['facility', 'applicant:id,name,email,phone', 'reviewer:id,name'])
                ->when($validated['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
                ->latest('submitted_at')
                ->paginate(20),
        );
    }

    public function show(FacilityVerificationApplication $application): JsonResponse
    {
        return response()->json(
            $application->load(['facility', 'applicant:id,name,email,phone', 'reviewer:id,name']),
        );
    }

    public function review(Request $request, FacilityVerificationApplication $application): JsonResponse
    {
        $validated = $request->validate([
            'decision' => ['required', Rule::in(['under_review', 'approved', 'rejected', 'more_information_requested'])],
            'reviewer_notes' => [
                Rule::requiredIf(in_array($request->input('decision'), ['rejected', 'more_information_requested'], true)),
                'nullable',
                'string',
                'max:3000',
            ],
        ]);

        DB::transaction(function () use ($request, $application, $validated): void {
            $application->update([
                'status' => $validated['decision'],
                'reviewer_notes' => $validated['reviewer_notes'] ?? null,
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
            ]);

            $application->facility->update([
                'verification_status' => $validated['decision'],
                'is_active' => $validated['decision'] === 'approved',
            ]);

            AuditLog::query()->create([
                'actor_user_id' => $request->user()->id,
                'action' => 'facility_verification.'.$validated['decision'],
                'subject_type' => FacilityVerificationApplication::class,
                'subject_id' => $application->id,
                'metadata' => ['reviewer_notes' => $validated['reviewer_notes'] ?? null],
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);
        });

        return response()->json([
            'message' => 'Facility verification decision recorded.',
            'application' => $application->fresh()->load('facility'),
        ]);
    }
}
