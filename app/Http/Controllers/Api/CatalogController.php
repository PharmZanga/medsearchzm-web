<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use App\Models\MedicalService;
use App\Models\Medicine;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['required', 'string', 'min:2', 'max:100'],
            'province' => ['nullable', 'string', 'max:100'],
            'district' => ['nullable', 'string', 'max:100'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:25'],
        ]);

        $query = trim($validated['q']);
        $limit = $validated['limit'] ?? 10;

        $facilities = Facility::query()
            ->published()
            ->when($validated['province'] ?? null, fn (Builder $builder, string $province) => $builder->where('province', $province))
            ->when($validated['district'] ?? null, fn (Builder $builder, string $district) => $builder->where('district', $district))
            ->where(function (Builder $builder) use ($query): void {
                $builder->where('name', 'like', "%{$query}%")
                    ->orWhere('type', 'like', "%{$query}%")
                    ->orWhere('address', 'like', "%{$query}%");
            })
            ->limit($limit)
            ->get();

        $medicines = Medicine::query()
            ->published()
            ->where(function (Builder $builder) use ($query): void {
                $builder->where('name', 'like', "%{$query}%")
                    ->orWhere('generic_name', 'like', "%{$query}%")
                    ->orWhere('brand_name', 'like', "%{$query}%")
                    ->orWhere('category', 'like', "%{$query}%");
            })
            ->limit($limit)
            ->get();

        $services = MedicalService::query()
            ->published()
            ->where(function (Builder $builder) use ($query): void {
                $builder->where('name', 'like', "%{$query}%")
                    ->orWhere('category', 'like', "%{$query}%");
            })
            ->limit($limit)
            ->get();

        return response()->json([
            'query' => $query,
            'results' => compact('facilities', 'medicines', 'services'),
        ]);
    }

    public function facilities(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['nullable', 'in:pharmacy,hospital,clinic,laboratory,imaging,dental,physiotherapy'],
            'province' => ['nullable', 'string', 'max:100'],
            'district' => ['nullable', 'string', 'max:100'],
            'delivery' => ['nullable', 'boolean'],
            'open_24_hours' => ['nullable', 'boolean'],
        ]);

        $facilities = Facility::query()
            ->published()
            ->when($validated['type'] ?? null, fn (Builder $query, string $type) => $query->where('type', $type))
            ->when($validated['province'] ?? null, fn (Builder $query, string $province) => $query->where('province', $province))
            ->when($validated['district'] ?? null, fn (Builder $query, string $district) => $query->where('district', $district))
            ->when(array_key_exists('delivery', $validated), fn (Builder $query) => $query->where('offers_delivery', $validated['delivery']))
            ->when(array_key_exists('open_24_hours', $validated), fn (Builder $query) => $query->where('is_open_24_hours', $validated['open_24_hours']))
            ->with('services')
            ->orderBy('name')
            ->paginate(20);

        return response()->json($facilities);
    }

    public function facility(Facility $facility): JsonResponse
    {
        abort_unless($facility->is_active && $facility->verification_status === 'verified', 404);

        return response()->json($facility->load(['services', 'medicines']));
    }

    public function medicines(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category' => ['nullable', 'string', 'max:100'],
            'brand' => ['nullable', 'string', 'max:100'],
            'prescription_required' => ['nullable', 'boolean'],
        ]);

        $medicines = Medicine::query()
            ->published()
            ->when($validated['category'] ?? null, fn (Builder $query, string $category) => $query->where('category', $category))
            ->when($validated['brand'] ?? null, fn (Builder $query, string $brand) => $query->where('brand_name', $brand))
            ->when(array_key_exists('prescription_required', $validated), fn (Builder $query) => $query->where('prescription_required', $validated['prescription_required']))
            ->with(['facilities' => fn ($query) => $query->published()])
            ->orderBy('name')
            ->paginate(20);

        return response()->json($medicines);
    }

    public function medicine(Medicine $medicine): JsonResponse
    {
        abort_unless($medicine->is_active, 404);

        return response()->json($medicine->load(['facilities' => fn ($query) => $query->published()]));
    }

    public function services(): JsonResponse
    {
        return response()->json(
            MedicalService::query()
                ->published()
                ->with(['facilities' => fn ($query) => $query->published()])
                ->orderBy('category')
                ->orderBy('name')
                ->paginate(30),
        );
    }
}
