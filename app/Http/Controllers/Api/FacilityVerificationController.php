<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use App\Models\FacilityVerificationApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Throwable;

class FacilityVerificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()
                ->facilityVerificationApplications()
                ->with('facility')
                ->latest()
                ->paginate(15),
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:190'],
            'type' => ['required', 'in:pharmacy,hospital,clinic,laboratory,imaging,dental,physiotherapy'],
            'license_number' => ['required', 'string', 'max:100', Rule::unique('facilities', 'license_number')],
            'province' => ['required', 'string', 'max:100'],
            'district' => ['required', 'string', 'max:100'],
            'address' => ['required', 'string', 'max:500'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'phone' => ['required', 'regex:/^\+?[1-9]\d{7,14}$/'],
            'email' => ['nullable', 'email:rfc', 'max:190'],
            'is_open_24_hours' => ['sometimes', 'boolean'],
            'offers_delivery' => ['sometimes', 'boolean'],
            'applicant_notes' => ['nullable', 'string', 'max:2000'],
            'documents' => ['required', 'array', 'min:1', 'max:5'],
            'documents.*' => ['file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ]);

        $storedDocuments = collect($request->file('documents'))->map(function ($document): array {
            return [
                'disk' => 'local',
                'path' => $document->store('verification-documents', 'local'),
                'original_name' => $document->getClientOriginalName(),
                'mime_type' => $document->getMimeType(),
                'size' => $document->getSize(),
            ];
        })->all();

        try {
            [$facility, $application] = DB::transaction(function () use ($request, $validated, $storedDocuments): array {
                $facility = Facility::query()->create([
                    'owner_user_id' => $request->user()->id,
                    'name' => $validated['name'],
                    'slug' => str($validated['name'].'-'.str()->random(6))->slug(),
                    'type' => $validated['type'],
                    'license_number' => $validated['license_number'],
                    'province' => $validated['province'],
                    'district' => $validated['district'],
                    'address' => $validated['address'],
                    'latitude' => $validated['latitude'] ?? null,
                    'longitude' => $validated['longitude'] ?? null,
                    'phone' => $validated['phone'],
                    'email' => $validated['email'] ?? null,
                    'is_open_24_hours' => $validated['is_open_24_hours'] ?? false,
                    'offers_delivery' => $validated['offers_delivery'] ?? false,
                    'verification_status' => 'submitted',
                    'is_active' => false,
                ]);

                $application = $facility->verificationApplications()->create([
                    'applicant_user_id' => $request->user()->id,
                    'status' => 'submitted',
                    'documents' => $storedDocuments,
                    'applicant_notes' => $validated['applicant_notes'] ?? null,
                    'submitted_at' => now(),
                ]);

                return [$facility, $application];
            });
        } catch (Throwable $exception) {
            Storage::disk('local')->delete(array_column($storedDocuments, 'path'));
            throw $exception;
        }

        return response()->json([
            'message' => 'Facility verification application submitted.',
            'facility' => $facility,
            'application' => $application,
        ], 201);
    }
}
