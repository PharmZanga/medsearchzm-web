<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['nullable', 'email:rfc', 'max:190', 'unique:users,email', 'required_without:phone'],
            'phone' => ['nullable', 'regex:/^\+?[1-9]\d{7,14}$/', 'unique:users,phone', 'required_without:email'],
            'password' => ['required', 'confirmed', Password::min(10)->letters()->numbers()],
            'account_type' => ['required', 'in:patient,health_worker,facility'],
        ]);

        $user = User::query()->create($validated + ['status' => 'active']);
        $user->assignRole($validated['account_type']);

        return response()->json([
            'message' => 'Registration successful.',
            'token' => $user->createToken('medsearch-client')->plainTextToken,
            'user' => $this->userPayload($user),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'identifier' => ['required', 'string', 'max:190'],
            'password' => ['required', 'string'],
            'device_name' => ['nullable', 'string', 'max:100'],
        ]);

        $identifierColumn = filter_var($validated['identifier'], FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';
        $user = User::query()->where($identifierColumn, $validated['identifier'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'The supplied credentials are invalid.'], 422);
        }

        if ($user->status !== 'active') {
            return response()->json(['message' => 'This account is not active.'], 403);
        }

        return response()->json([
            'message' => 'Login successful.',
            'token' => $user->createToken($validated['device_name'] ?? 'medsearch-client')->plainTextToken,
            'user' => $this->userPayload($user),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $this->userPayload($request->user())]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'account_type' => $user->account_type,
            'status' => $user->status,
            'roles' => $user->getRoleNames()->values(),
            'permissions' => $user->getAllPermissions()->pluck('name')->values(),
        ];
    }
}
