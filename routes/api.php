<?php

use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FacilityVerificationController;
use App\Http\Controllers\Api\Admin\FacilityVerificationController as AdminFacilityVerificationController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/health', fn () => response()->json([
        'service' => 'MedSearch Africa API',
        'status' => 'ok',
        'version' => 'v1',
    ]));

    Route::get('/search', [CatalogController::class, 'search']);

    Route::get('/facilities', [CatalogController::class, 'facilities']);
    Route::get('/facilities/{facility}', [CatalogController::class, 'facility']);

    Route::get('/medicines', [CatalogController::class, 'medicines']);
    Route::get('/medicines/{medicine}', [CatalogController::class, 'medicine']);

    Route::get('/services', [CatalogController::class, 'services']);

    Route::prefix('auth')->middleware('throttle:10,1')->group(function (): void {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
    });

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::prefix('facility-verifications')->middleware('role:facility')->group(function (): void {
            Route::get('/', [FacilityVerificationController::class, 'index']);
            Route::post('/', [FacilityVerificationController::class, 'store'])->middleware('throttle:5,1');
        });

        Route::prefix('admin/facility-verifications')->middleware('permission:verify_facilities')->group(function (): void {
            Route::get('/', [AdminFacilityVerificationController::class, 'index']);
            Route::get('/{application}', [AdminFacilityVerificationController::class, 'show']);
            Route::patch('/{application}/review', [AdminFacilityVerificationController::class, 'review']);
        });
    });
});
