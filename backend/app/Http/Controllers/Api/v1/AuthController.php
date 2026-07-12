<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginValidator;
use App\Http\Requests\RegistrationValidator;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(protected AuthService $authService) {}

    /**
     * Register a new user.
     */
    public function register(RegistrationValidator $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());

        return response()->json([
            'code' => 201,
            'status' => 'success',
            'message' => 'User registered successfully',
            'data' => [
                'user' => new UserResource($result['user']),
                'access_token' => $result['access_token'],
                'token_type' => $result['token_type'],
            ],
        ], 201);
    }

    /**
     * Authenticate a user.
     */
    public function login(LoginValidator $request): JsonResponse
    {
        $result = $this->authService->login($request->validated());

        return response()->json([
            'code' => 200,
            'status' => 'success',
            'message' => 'User logged in successfully',
            'data' => [
                'user' => new UserResource($result['user']),
                'access_token' => $result['access_token'],
                'token_type' => $result['token_type'],
            ],
        ]);
    }

    /**
     * Return the currently authenticated user.
     *
     * Serialized as `{ data: {...} }` so the frontend can read `data.data`
     * to restore its session on boot.
     */
    public function me(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    /**
     * Logout the authenticated user.
     */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json([
            'code' => 200,
            'status' => 'success',
            'message' => 'User logged out successfully',
        ]);
    }
}